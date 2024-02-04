---
layout: post
title: protohax源码分析⑵
date: 2024-2-4
categories: protohax
tags: protohax
---

**protohax源码分析⑵**

继上文[protohax源码分析⑴](https://csjdyr001.github.io/2024/02/04/protohax-code1.html)

继续看chat方法，该方法调用了sendPacketToClient方法，这个方法如下：
```
fun sendPacketToClient(packet: BedrockPacket) {
        val event = EventPacketInbound(this, packet)
        eventManager.emit(event)
        if (event.isCanceled()) {
            return
        }
        netSession.inboundPacket(packet)
    }
```
我们一行行的分析，该方法接收一个BedrockPacket类，在上篇文章中我已经提到了，然后创建一个EventPacketInbound类，再调用EventManager的emit方法，那这个EventPacketOutbound类又是什么呢？我们先假设它是org.cloudburstmc.protocol.bedrock.packet的子类，转到EventManager类查看emit方法如下：
```
private val registry = mutableMapOf<Class<out GameEvent>, ArrayList<EventHook<in GameEvent>>>()

fun emit(event: GameEvent) {
        for (handler in (registry[event.javaClass] ?: return)) {
            try {
				if (handler.condition(event)) {
					handler.handler(event)
				}
            } catch (t: Throwable) {
                logError("event ${event.friendlyName}", t)
            }
        }
    }
```
这个方法大致就是从registry中获取GameEvent类的class对象项值做为EventHook类实例，EventHook的代码如下：
```
typealias Handler<T> = T.() -> Unit

class EventHook<T : GameEvent> (
    val eventClass: Class<T>,
    val handler: Handler<T>,
    val condition: (T) -> Boolean = { true }
) {

    constructor(eventClass: Class<T>, handler: Handler<T>, listenable: Listenable)
            : this(eventClass, handler, { listenable.handleEvents })
}
```

由此可见emit方法接收一个GameEvent类型，而在其他开发者的jar包中不可能出现protohax的类，所以推翻了这个猜测，经过我的一番查找，终于在Events.kt这个文件中发现了EventPacketInbound类，Events.kt的代码如下：
```
import dev.sora.relay.game.GameSession
import dev.sora.relay.game.entity.Entity
import dev.sora.relay.game.inventory.AbstractInventory
import dev.sora.relay.game.world.chunk.Chunk
import org.cloudburstmc.protocol.bedrock.packet.BedrockPacket

abstract class GameEvent(val session: GameSession, val friendlyName: String)

abstract class GameEventCancellable(session: GameSession, friendlyName: String) : GameEvent(session, friendlyName) {

    private var canceled = false

    open fun cancel() {
        canceled = true
    }

    open fun isCanceled() = canceled

}

class EventTick(session: GameSession) : GameEvent(session, "tick")

class EventPostTick(session: GameSession) : GameEvent(session, "post_tick")

/**
 * @param reason BedrockDisconnectReasons
 */
class EventDisconnect(session: GameSession, val client: Boolean, val reason: String) : GameEvent(session, "disconnect")

class EventPacketInbound(session: GameSession, val packet: BedrockPacket) : GameEventCancellable(session, "packet_inbound")

class EventPacketOutbound(session: GameSession, val packet: BedrockPacket) : GameEventCancellable(session, "packet_outbound")

class EventPacketPostOutbound(session: GameSession, val packet: BedrockPacket) : GameEvent(session, "packet_post_outbound")

/**
 * the container just "initialized", the content not received
 */
class EventContainerOpen(session: GameSession, val container: AbstractInventory) : GameEvent(session, "container_open")

class EventContainerClose(session: GameSession, val container: AbstractInventory) : GameEvent(session, "container_close")

/**
 * triggered on LevelChunkPacket,
 * but be aware if the chunk have separate subchunks deliver, the subchunk will not be loaded on the event call
 */
class EventChunkLoad(session: GameSession, val chunk: Chunk) : GameEvent(session, "chunk_load")

class EventChunkUnload(session: GameSession, val chunk: Chunk) : GameEvent(session, "chunk_unload")

class EventDimensionChange(session: GameSession, val dimension: Int) : GameEvent(session, "dimension_change")

class EventEntitySpawn(session: GameSession, val entity: Entity) : GameEvent(session, "entity_spawn")

class EventEntityDespawn(session: GameSession, val entity: Entity) : GameEvent(session, "entity_despawn")
```
回到sendPacketToClient方法继续看，调用了MinecraftRelaySession类的inboundPacket方法，inboundPacket方法又调用了sendPacket方法，但是在这个文件中并没有找到这个方法，最后发现这个类继承自org.cloudburstmc.protocol.bedrock.BedrockServerSession类，源码如下：
```
import org.checkerframework.checker.nullness.qual.Nullable;
import org.cloudburstmc.protocol.bedrock.packet.DisconnectPacket;

public class BedrockServerSession extends BedrockSession {

    public BedrockServerSession(BedrockPeer peer, int subClientId) {
        super(peer, subClientId);
    }

    public void disconnect(@Nullable String reason, boolean hideReason) {
        this.checkForClosed();

        DisconnectPacket packet = new DisconnectPacket();
        if (reason == null || hideReason) {
            packet.setMessageSkipped(true);
            reason = BedrockDisconnectReasons.DISCONNECTED;
        }
        packet.setKickMessage(reason);
        this.sendPacketImmediately(packet);
    }
}
```
这个类没有定义sendPacket方法，它继承自BedrockSession类，我们继续看这个类，发现sendPacket方法调用了BedrockPeer类的sendPacket方法，而这里的方法定义如下：
```
public void sendPacket(int senderClientId, int targetClientId, BedrockPacket packet) {
        ReferenceCountUtil.retain(packet);
        this.packetQueue.add(new BedrockPacketWrapper(0, senderClientId, targetClientId, packet, null));
    }
```

**本章就先分析到这里吧。**

---
layout: post
title: protohax源码分析⑴
date: 2024-2-4
categories: protohax
tags: protohax
---

**protohax源码分析⑴**

今天要分析的源码是[https://github.com/hax0r31337/ProtoHax](https://github.com/hax0r31337/ProtoHax)这个仓库

先看[build.gradle](https://github.com/hax0r31337/ProtoHax/blob/stable/build.gradle)文件，在第23行到第38行中有如下代码：
```
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.2")

    embed('org.cloudburstmc.protocol:bedrock-connection:3.0.0.Beta1-SNAPSHOT') {
        exclude group: 'com.nukkitx', module: 'natives'
    }

    embed 'com.google.code.gson:gson:2.10.1'
    embed('coelho.msftauth:minecraft-msftauth:2.1.6') {
        exclude group: 'com.squareup.okhttp3'
    }
    embed 'io.github._0x9fff00.leveldb:leveldb:0.10.2'
    embed('com.squareup.okhttp3:okhttp:4.11.0') {
        exclude group: 'org.jetbrains.kotlin'
    }
}
```
这些代码都是引入一些依赖库之类的，下载链接在文末。

再进入src/main/java/dev/sora/relay/game/路径，查看[GameSession.kt](https://github.com/hax0r31337/ProtoHax/blob/stable/src/main/java/dev/sora/relay/game/GameSession.kt)文件，发现继承自MinecraftRelayPacketListener类，而MinecraftRelayListener类是MinecraftRelay类的一个接口，我们先放到一旁。继续看GameSession类，可以看出这个类是用来修改、发送数据包的，在152到162行中，有一个名为chat的函数如下：
```
fun chat(msg: String) {
		logInfo("chat >> $msg")
		if (!netSessionInitialized) return
		sendPacketToClient(TextPacket().apply {
			type = TextPacket.Type.RAW
			isNeedsTranslation = false
			message = "[$COLORED_NAME] $msg"
			xuid = ""
			sourceName = ""
		})
	}
```
通过代码可以大致看出这是一个在minecraft中发送一个RAW消息（也就是在物品栏上方的信息，相当于minecraft中的/titleraw指令）的功能，而COLORED_NAME函数的内容则是protohax的标识：
```
const val COLORED_NAME = "§9§lProtoHax§r"
```
而这个函数中的TextPacket又是什么类呢？根据sendPacketToClient接收一个BedrockPacket类，这说明了TextPacket继承自BedrockPacket类，但是在GameSession.kt整个代码中都没发现明确指定TextPacket类的语句，在同级目录下也没有这样的类，这时，我发现了这一行import语句：
```
import org.cloudburstmc.protocol.bedrock.packet.*
```
我们可以猜测TextPacket这个类来自org.cloudburstmc.protocol.bedrock.packet包，顺着这个思路去寻找，在刚才的build.gradle中有导入一个名为org.cloudburstmc.protocol:bedrock-connection:3.0.0.Beta1-SNAPSHOT的包，排除了com.nukkitx包并使用[natives](https://github.com/CloudburstMC/Natives)包做为com.nukkitx的代替。而bedrock-connection/3.0.0.Beta1-SNAPSHOT这个包可以在[这里](https://repo.opencollab.dev/#/maven-snapshots/org/cloudburstmc/protocol/bedrock-connection/3.0.0.Beta1-SNAPSHOT)下载。

**本章就先分析到这吧。**



***本章谈到的依赖库链接***

[kotlinx-coroutines-core-1.7.2.jar](https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-coroutines-core/1.7.2/kotlinx-coroutines-core-1.7.2.jar)

[org.cloudburstmc.protocol:bedrock-connection:3.0.0.Beta1-SNAPSHOT](https://repo.opencollab.dev/#/maven-snapshots/org/cloudburstmc/protocol/bedrock-connection/3.0.0.Beta1-SNAPSHOT)

[natives](https://github.com/CloudburstMC/Natives)

[gson-2.10.1.jar](https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar)

[okhttp-4.11.0.jar](https://repo1.maven.org/maven2/com/squareup/okhttp3/okhttp/4.11.0/okhttp-4.11.0.jar)

[minecraft-msftauth-2.1.6.jar](https://github.com/SkidderMC/ProtoHax-PackageGit/raw/main/maven_repo/coelho/msftauth/minecraft-msftauth/2.1.6/minecraft-msftauth-2.1.6.jar)

[leveldb-0.10.2.jar](https://github.com/SkidderMC/ProtoHax-PackageGit/raw/main/maven_repo/io/github/_0x9fff00/leveldb/leveldb/0.10.2/leveldb-0.10.2.jar)
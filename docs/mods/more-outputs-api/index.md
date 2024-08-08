import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# More Ouputs API

### VERY BIG DISCLAIMER: This tutorial was written for Minecraft 1.20.4, ANY VERSION THAT IS NEWER WILL NOT WORK. Im currently working on making a 1.20.5+ tutorial, I don't know how long this will take, stay tuned and read well.

## Version scheme for More Outputs API

Note: it isnt worth backporting to version prior to 1.18 and certainly not prior to 1.14 so those versions won't be backported. Where ```x``` stands for the update of the mod & ```y``` stands for minecraft version suffix like 1.20.^^**1**^^. Note that ```z``` only appears when there is an actual bugfix, otherwise it will be for example ```2.x.y```. 

Minecraft Version | Mod Version| Mod Loader | Status
------------ | ------------- | --------- |------------
< 1.18 | -  | Fabric| *skipped*
1.18.x | 0.2.y.z | Fabric | *done*
1.19.x | 0.5.y.z | Fabric | *done*
1.20.x | 1.x.y.z | Fabric | *done*
1.21.x | 2.x.y.z | Fabric | *current version*

[![Modrinth](https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/cozy/available/modrinth_vector.svg)](https://modrinth.com/mod/more-outputs-api) 
[![CurseForge](https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/cozy/available/curseforge_vector.svg)](https://curseforge.com/minecraft/mc-mods/more-outputs-api)

Extra info on the mod such as download count can be found [here](../more-outputs-api/extra-info.md)

### Getting Started
<Tabs>
  <TabItem value="gradle_groovy" label="Gradle (Groovy)" default>
  
    ``` groovy title="In your build.gradle"
    // Should be in the TOP repositories block
    repositories {
        mavenCentral()

        maven {
            url = ("https://repo.repsy.io/mvn/scaredrabbit/scaredsmods")
        }
    }
    //Dependencies block
    modImplementation "io.github.scaredsmods.moreoutputsapi:MoreOutputsAPI:${project.moapi_version}"
    //OR 
    modApi "io.github.scaredsmods.moreoutputsapi:MoreOutputsAPI:${project.moapi_version}"
    ```
    ``` title="In your gradle.properties"
    moapi_version = VERSION
    ```
  </TabItem>

  <TabItem value="maven" label="Maven">

        ``` xml
        <!-- Should be in the <repositories></repositories> block -->
        <repository>
            <id>repsy</id>
            <url>https://repo.repsy.io/mvn/scaredrabbit/scaredsmods</url>
        </repository>

        <!-- Should be in the <dependencies></dependencies> block -->
        <dependency>
            <groupId>io.github.scaredsmods.moreoutputsapi</groupId>
            <artifactId>MoreOutputsAPI</artifactId>
            <version>VERSION</version>
        </dependency>
        ```
  </TabItem>
</Tabs>

```VERSION``` can either be found on [repsy](https://repsy.io/mvn/scaredrabbit/scaredsmods/io/github/scaredsmods/moreoutputsapi/MoreOutputsAPI/), [curseforge](https://www.curseforge.com/minecraft/mc-mods/more-outputs-api/files/all?page=1&pageSize=20) or [modrinth](https://modrinth.com/mod/more-outputs-api/).

## Usage
I would assume that you already know most of the things we are about to do, but for those that don't know, here is the tutorial!



### What we'll need

- A custom [block](../more-outputs-api/block.md).
- A (custom) [block entity](../more-outputs-api/block-entity/index.md). 
- A custom [recipe](../more-outputs-api/recipe/index.md) 
- A [screen(handler)](../more-outputs-api/screen/index.md) for the block entity


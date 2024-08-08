---
sidebar_position: 6
---


# Connections

## Connecting the Screen to the Client
This is really important because your client needs to know that the block entity you are clicking on, actually has a screenhandler and how to render that screenhandler.

### ClientModInitializer
To do this you need a class that implements ```ClientModInitializer```, in my case ```ExampleModClient```. Implement the ```onClientInitialize()``` method.

The following line adds the screen from the client:

```java

HandledScreens.register(ModScreenHandlers.EXAMPLE_SCREEN_HANDLER, ExampleScreen::new);

```

Full method:

```java

@Override
public void onInitializeClient() {
    [... Other client stuff ...]
    HandledScreens.register(ModScreenHandlers.EXAMPLE_SCREEN_HANDLER, ExampleScreen::new);
    [... Other client stuff ...]
}

```

This is dependent on the ```fabric.mod.json``` file in ```resources```. To let fabric know that this class exists, add this to your ```fabric.mod.json``` under the entrypoints section:

```json

"client": [
	"your.path.to.ModClient"
]

```
---
sidebar_position: 3
---


# Block Entity with four output slots


To create a block entity with four output slots, create a new class in ```net.example.yourmodid.block.entity```, the class extends ```BlockEntity``` and implements ```ExtendedScreenHandlerFactory, ImplementedInventory```

In action, it would look like this:

```java

public class ExampleBlockEntity extends BlockEntity implements ExtendedScreenHandlerFactory, ImplmentedInventory {


}
```

## Fields & constructor

Before we can make all the required methods, we need a few fields and a constructor.

```java 
private final DefaultedList<ItemStack> inventory = DefaultedList.ofSize(5, ItemStack.EMPTY);

private static final int INPUT_SLOT = 0;
private static final int OUTPUT_SLOT_1 = 1;
private static final int OUTPUT_SLOT_2 = 2;
private static final int OUTPUT_SLOT_3 = 3;
private static final int OUTPUT_SLOT_4 = 4;

protected final PropertyDelegate propertyDelegate;
private int progress = 0; 
private int maxProgress = 100; 
```
:::warning

- IMPORTANT: The size specicified in the ```inventory``` field should be the total amount of slots in the block entity & recipe. Including the input & output slots or any other slots
- ```progress``` is the progress the recipe currently has
- ```maxProgress``` is the max amount of time the crafting takes. Not in seconds!

:::





The constructor should look like this:

```java
public ExampleBlockEntity(BlockPos pos, BlockState state) {
    super(ModBlockEntities.EXAMPLE_BLOCK_ENTITY, pos, state);
    this.propertyDelegate = new PropertyDelegate() {
        @Override
        public int get(int index) {
            return switch (index) {
                case 0 -> ExampleBlockEntity.this.progress;
                case 1 -> ExampleBlockEntity.this.maxProgress;
                default -> 0;
            };
        }

        @Override
        public void set(int index, int value) {
            switch (index) {
                case 0 -> ExampleBlockEntity.this.progress = value;
                case 1 -> ExampleBlockEntity.this.maxProgress = value;
            }
        }

        @Override
        public int size() {
            return 5;
        }
    };
}

```

:::warning
- ```size()``` should return the total size of the inventory! All possible slots should be included!

:::

## Required methods
Now we can make all the required methods neccessary: 

```java title="writeScreenOpeningData()"
@Override
public void writeScreenOpeningData(ServerPlayerEntity player, PacketByteBuf buf) {
    buf.writeBlockPos(this.pos);
}
```

```java title="getDisplayName()"
@Override
public Text getDisplayName() {
    return Text.literal("Example Block");
}
```
:::info
- I would recommend that you make this translatable by replacing ```Text.literal()``` with ```Text.translatable``` and adding a translation key and translate it in for example ```en_us.json```
:::

```java title="getItems()"
@Override
public DefaultedList<ItemStack> getItems() {
    return inventory;
}
```

```java title="readNbt() and writeNbt()"
@Override
public void writeNbt(NbtCompound nbt) {
    super.writeNbt(nbt);
    Inventories.writeNbt(nbt, inventory);
    nbt.putInt("example_block.progress", progress);
}

@Override
public void readNbt(NbtCompound nbt) {
    super.readNbt(nbt);
    Inventories.readNbt(nbt, inventory);
    progress = nbt.getInt("example_block.progress");
}

```
:::warning
- The strings provided in ```putInt()``` and ```getInt()``` should be exactly the same, otherwise the server isn't able to read the nbt data!
:::

```java title="createMenu()"
@Nullable
@Override
public ScreenHandler createMenu(int syncId, PlayerInventory playerInventory, PlayerEntity player) {
    return new ExampleScreenHandler(syncId, playerInventory, this, this.propertyDelegate);
}
```
:::danger
```ExampleScreenHandler``` has not been created yet so there is an error present here!
:::



```java title="tick()"

public void tick(World world, BlockPos pos, BlockState state) {//(1)!
    if(world.isClient()) {
        return;
    }

    
    if(areOutputSlotsEmptyOreReceivable()) {
        if(this.hasRecipe()) {
            this.increaseCraftProgress();
            markDirty(world, pos, state);

            if(hasCraftingFinished()) {
                this.craftItem();
                this.resetProgress();
            }
        } else {
            this.resetProgress();
        }
    } else {
        this.resetProgress();
        markDirty(world, pos, state);
    }
}
```

:::danger
- Errors are present in ```tick()``` because we haven't made most of these methods yet!
:::


Now we are going to make the methods that are going to have influence on how the ```tick()``` method above behaves.
Im doing it from top to bottom, and the first method (or boolean) is:

```java title="areOutputSlotsEmptyOrReceivable()"
private boolean areOutputsSlotEmptyOrReceivable() {
    return (this.getStack(OUTPUT_SLOT_1).isEmpty() || this.getStack(OUTPUT_SLOT_1).getCount() < this.getStack(OUTPUT_SLOT_1).getMaxCount())
            &&
            (this.getStack(OUTPUT_SLOT_2).isEmpty() || this.getStack(OUTPUT_SLOT_2).getCount() < this.getStack(OUTPUT_SLOT_2).getMaxCount())
            && 
            (this.getStack(OUTPUT_SLOT_3).isEmpty() || this.getStack(OUTPUT_SLOT_3).getCount() < this.getStack(OUTPUT_SLOT_3).getMaxCount())
            &&
            (this.getStack(OUTPUT_SLOT_4).isEmpty() || this.getStack(OUTPUT_SLOT_4).getCount() < this.getStack(OUTPUT_SLOT_4).getMaxCount());
}
```
What we are doing here, is checking if the output slots are empty or in the case that there ís an item in the slot, we check if the amount of items is smaller than 64 (```getMaxCount()```)



Then, we check if the block entity has a recipe with ```hasRecipe()``` but before that methods, we need two other helper methods:

```java title="canInsertItemIntoOutputSlots() & canInsertAmountIntoOutputSlots()"
private boolean canInsertItemIntoOutputSlots(Item item, Item item2, Item item3, Item item4) {
    return (this.getStack(OUTPUT_SLOT_1).getItem() == item || this.getStack(OUTPUT_SLOT_1).isEmpty()) &&
        (this.getStack(OUTPUT_SLOT_2).getItem() == item2 || this.getStack(OUTPUT_SLOT_2).isEmpty()) &&
        (this.getStack(OUTPUT_SLOT_3).getItem() == item3 || this.getStack(OUTPUT_SLOT_3).isEmpty()) &&
        (this.getStack(OUTPUT_SLOT_4).getItem() == item4 || this.getStack(OUTPUT_SLOT_4).isEmpty());
    }

private boolean canInsertAmountIntoOutputSlots(ItemStack result, ItemStack result2, ItemStack result3, ItemStack result4) {
    return this.getStack(OUTPUT_SLOT_1).getCount() + result.getCount() <= getStack(OUTPUT_SLOT_1).getMaxCount() &&
        this.getStack(OUTPUT_SLOT_2).getCount() + result2.getCount() <= getStack(OUTPUT_SLOT_2).getMaxCount() &&
        this.getStack(OUTPUT_SLOT_3).getCount() + result3.getCount() <= getStack(OUTPUT_SLOT_3).getMaxCount() &&
        this.getStack(OUTPUT_SLOT_4).getCount() + result4.getCount() <= getStack(OUTPUT_SLOT_4).getMaxCount();
}
```
As you can see, we have two items in the first method, we check if the same item is in output slot 1 or 2 (or 3 or 4)  or that the output slot is empty.
In the second method we compore the amount of items already in the output slots added to the result if thats smaller or equal to the maximum count of 64.




Here we check if there is an item that can be inserted into the output slots and if there is a correct amount of it.

```java title="hasRecipe()"

private boolean hasRecipe() {
    Optional<RecipeEntry<ExampleRecipe>> recipe = getCurrentRecipe();

    return recipe.isPresent() && canInsertAmountIntoOutputSlot(recipe.get().value().getResult(null), recipe.get().value().getSecondResult(null), 
        recipe.get().value().getThirdResult(null), recipe.get().value().getFourthResult(null))
           
        && 
        canInsertItemIntoOutputSlot(recipe.get().value().getResult(null).getItem(), recipe.get().value().getSecondResult(null).getItem(), 
            recipe.get().value().getThirdResult(null).getItem(), recipe.get().value().getFourthResult(null).getItem());
}
```


:::danger
In the ```hasRecipe()```, ```getCurrentRecipe``` and ```craftItem()``` methods should be a few errors present as there isn't any form of recipe yet. We will create that soon!
:::

The ```increaseCraftProgress()```, ```resetProgress()``` and ```hasCraftingFinished``` methods aren't really that special so I'll list them here:




```java title="resetProgress() & increaseCraftProgress() & hasCraftingFinished()"
private void resetProgress() {
    this.progress = 0;
}
private void increaseCraftProgress() {
    progress++;
}
private boolean hasCraftingFinished() {
    return progress >= maxProgress;
}
```
Before we can make the last method used in the ```tick()``` method, we need a helper method called ```getCurrentRecipe()``` which gets the current recipe by accessing the recipe manager.
```java title="getCurrentRecipe()"
private Optional<RecipeEntry<ExampleRecipe>> getCurrentRecipe() {
    SimpleInventory inv = new SimpleInventory(this.size());
    for(int i = 0; i < this.size(); i++) {
        inv.setStack(i, this.getStack(i));
    }

    return getWorld().getRecipeManager().getFirstMatch(ExampleRecipe.Type.INSTANCE, inv, getWorld());
}
```
Now we can make the ```craftItems()``` method:

```java title="craftItems()"
private void craftItem() {
    Optional<RecipeEntry<ExampleRecipe>> recipe = getCurrentRecipe();

    this.removeStack(INPUT_SLOT, 1);

    this.setStack(OUTPUT_SLOT_1, new ItemStack(recipe.get().value().getResult(null).getItem(),
        getStack(OUTPUT_SLOT_1).getCount() + recipe.get().value().getResult(null).getCount()));
    this.setStack(OUTPUT_SLOT_2, new ItemStack(recipe.get().value().getSecondResult(null).getItem(),
        getStack(OUTPUT_SLOT_2).getCount() + recipe.get().value().getSecondResult(null).getCount()));
    this.setStack(OUTPUT_SLOT_3), new ItemStack(recipe.get().value().getThirdResult(null).getItem(), 
        getStack(OUTPUT_SLOT_3).getCount() + recipe.get().value().getThirdResult(null).getItem());
    this.setStack(OUTPUT_SLOT_4), new ItemStack(recipe.get().value().getFourthResult(null).getItem(), 
        getStack(OUTPUT_SLOT_4).getCount() + recipe.get().value().getFourthResult(null).getItem());
}

```

The last thing, for the block entity, we need to do is override two more methods:

```java title="toUpdatePacket() & toInitialChunkDataNbt()"

@Nullable
@Override
public Packet<ClientPlayPacketListener> toUpdatePacket() {
    return BlockEntityUpdateS2CPacket.create(this);
}

@Override
public NbtCompound toInitialChunkDataNbt() {
    return createNbt();
}

```

The finished class should look something like this:

```java title="Finished class"

import io.github.scaredsmods.examplemod.recipe.ExampleRecipe;
import io.github.scaredsmods.examplemod.screenhandler.ExampleScreenHandler;
import net.fabricmc.fabric.api.screenhandler.v1.ExtendedScreenHandlerFactory;
import net.minecraft.block.BlockState;
import net.minecraft.block.entity.BlockEntity;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.entity.player.PlayerInventory;
import net.minecraft.inventory.Inventories;
import net.minecraft.inventory.SimpleInventory;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.nbt.NbtCompound;
import net.minecraft.network.PacketByteBuf;
import net.minecraft.network.listener.ClientPlayPacketListener;
import net.minecraft.network.packet.Packet;
import net.minecraft.network.packet.s2c.play.BlockEntityUpdateS2CPacket;
import net.minecraft.recipe.RecipeEntry;
import net.minecraft.screen.PropertyDelegate;
import net.minecraft.screen.ScreenHandler;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import net.minecraft.util.collection.DefaultedList;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.World;
import org.jetbrains.annotations.Nullable;

import java.util.Optional;

public class ExampleBlockEntity extends BlockEntity implements ExtendedScreenHandlerFactory, ImplementedInventory{

    private final DefaultedList<ItemStack> inventory = DefaultedList.ofSize(5, ItemStack.EMPTY);

    private static final int INPUT_SLOT = 0;
    private static final int OUTPUT_SLOT_1 = 1;
    private static final int OUTPUT_SLOT_2 = 2;
    private static final int OUTPUT_SLOT_3 = 3;
    private static final int OUTPUT_SLOT_4 = 4;

    protected final PropertyDelegate propertyDelegate;
    private int progress = 0;
    private int maxProgress = 100;

    public ExampleBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.EXAMPLE_BLOCK_ENTITY, pos, state);
        this.propertyDelegate = new PropertyDelegate() {
            @Override
            public int get(int index) {
                return switch (index) {
                    case 0 -> ExampleBlockEntity.this.progress;
                    case 1 -> ExampleBlockEntity.this.maxProgress;
                    default -> 0;
                };
            }

            @Override
            public void set(int index, int value) {
                switch (index) {
                    case 0 -> ExampleBlockEntity.this.progress = value;
                    case 1 -> ExampleBlockEntity.this.maxProgress = value;
                }
            }

            @Override
            public int size() {
                return 5;
            }
        };
    }


    @Override
    public void writeScreenOpeningData(ServerPlayerEntity player, PacketByteBuf buf) {
        buf.writeBlockPos(this.pos);
    }


    @Override
    public Text getDisplayName() {
        return Text.literal("Example");//(1)!
    }

    @Override
    public DefaultedList<ItemStack> getItems() {
        return inventory;
    }

    @Override
    public void writeNbt(NbtCompound nbt) {
        super.writeNbt(nbt);
        Inventories.writeNbt(nbt, inventory);
        nbt.putInt("example_block.progress", progress);
    }

    @Override
    public void readNbt(NbtCompound nbt) {
        super.readNbt(nbt);
        Inventories.readNbt(nbt, inventory);
        progress = nbt.getInt("example_block.progress");
    }


    @Nullable
    @Override
    public ScreenHandler createMenu(int syncId, PlayerInventory playerInventory, PlayerEntity player) {
        return new ExampleScreenHandler(syncId, playerInventory, this, this.propertyDelegate);
    }

    public void tick(World world, BlockPos pos, BlockState state) {
        if(world.isClient()) {
            return;
        }

        if(areOutputsSlotEmptyOrReceivable()) {
            if(this.hasRecipe()) {
                this.increaseCraftProgress();
                markDirty(world, pos, state);

                if(hasCraftingFinished()) {
                    this.craftItem();
                    this.resetProgress();
                }
            } else {
                this.resetProgress();
            }
        } else {
            this.resetProgress();
            markDirty(world, pos, state);
        }
    }

    private void resetProgress() {
        this.progress = 0;
    }

    private void craftItem() {
    Optional<RecipeEntry<ExampleRecipe>> recipe = getCurrentRecipe();

        this.removeStack(INPUT_SLOT, 1);

        this.setStack(OUTPUT_SLOT_1, new ItemStack(recipe.get().value().getResult(null).getItem(),
            getStack(OUTPUT_SLOT_1).getCount() + recipe.get().value().getResult(null).getCount()));
        this.setStack(OUTPUT_SLOT_2, new ItemStack(recipe.get().value().getSecondResult(null).getItem(),
            getStack(OUTPUT_SLOT_2).getCount() + recipe.get().value().getSecondResult(null).getCount()));
        this.setStack(OUTPUT_SLOT_3), new ItemStack(recipe.get().value().getThirdResult(null).getItem(), 
            getStack(OUTPUT_SLOT_3).getCount() + recipe.get().value().getThirdResult(null).getItem());
        this.setStack(OUTPUT_SLOT_4), new ItemStack(recipe.get().value().getFourthResult(null).getItem(), 
            getStack(OUTPUT_SLOT_4).getCount() + recipe.get().value().getFourthResult(null).getItem());
    }   

    private boolean hasCraftingFinished() {
        return progress >= maxProgress;
    }

    private void increaseCraftProgress() {
        progress++;
    }

    private boolean hasRecipe() {
    Optional<RecipeEntry<ExampleRecipe>> recipe = getCurrentRecipe();

        return recipe.isPresent() && canInsertAmountIntoOutputSlot(recipe.get().value().getResult(null), recipe.get().value().getSecondResult(null), 
                recipe.get().value().getThirdResult(null), recipe.get().value().getFourthResult(null))
           
            && 
            canInsertItemIntoOutputSlot(recipe.get().value().getResult(null).getItem(), recipe.get().value().getSecondResult(null).getItem(), 
                recipe.get().value().getThirdResult(null).getItem(), recipe.get().value().getFourthResult(null).getItem());
    }

    private Optional<RecipeEntry<ExampleRecipe>> getCurrentRecipe() {
        SimpleInventory inv = new SimpleInventory(this.size());
        for(int i = 0; i < this.size(); i++) {
            inv.setStack(i, this.getStack(i));
        }

        return getWorld().getRecipeManager().getFirstMatch(ExampleRecipe.Type.INSTANCE, inv, getWorld());
    }

    private boolean canInsertItemIntoOutputSlots(Item item, Item item2, Item item3, Item item4) {
    return (this.getStack(OUTPUT_SLOT_1).getItem() == item || this.getStack(OUTPUT_SLOT_1).isEmpty()) &&
        (this.getStack(OUTPUT_SLOT_2).getItem() == item2 || this.getStack(OUTPUT_SLOT_2).isEmpty()) &&
        (this.getStack(OUTPUT_SLOT_3).getItem() == item3 || this.getStack(OUTPUT_SLOT_3).isEmpty()) &&
        (this.getStack(OUTPUT_SLOT_4).getItem() == item4 || this.getStack(OUTPUT_SLOT_4).isEmpty());
    }

    private boolean canInsertAmountIntoOutputSlots(ItemStack result, ItemStack result2, ItemStack result3, ItemStack result4) {
        return this.getStack(OUTPUT_SLOT_1).getCount() + result.getCount() <= getStack(OUTPUT_SLOT_1).getMaxCount() &&
            this.getStack(OUTPUT_SLOT_2).getCount() + result2.getCount() <= getStack(OUTPUT_SLOT_2).getMaxCount() &&
            this.getStack(OUTPUT_SLOT_3).getCount() + result3.getCount() <= getStack(OUTPUT_SLOT_3).getMaxCount() &&
            this.getStack(OUTPUT_SLOT_4).getCount() + result4.getCount() <= getStack(OUTPUT_SLOT_4).getMaxCount();
    }

    private boolean areOutputsSlotEmptyOrReceivable() {
    return (this.getStack(OUTPUT_SLOT_1).isEmpty() || this.getStack(OUTPUT_SLOT_1).getCount() < this.getStack(OUTPUT_SLOT_1).getMaxCount())
            &&
            (this.getStack(OUTPUT_SLOT_2).isEmpty() || this.getStack(OUTPUT_SLOT_2).getCount() < this.getStack(OUTPUT_SLOT_2).getMaxCount())
            && 
            (this.getStack(OUTPUT_SLOT_3).isEmpty() || this.getStack(OUTPUT_SLOT_3).getCount() < this.getStack(OUTPUT_SLOT_3).getMaxCount())
            &&
            (this.getStack(OUTPUT_SLOT_4).isEmpty() || this.getStack(OUTPUT_SLOT_4).getCount() < this.getStack(OUTPUT_SLOT_4).getMaxCount());
    }  

    @Nullable
    @Override
    public Packet<ClientPlayPacketListener> toUpdatePacket() {
        return BlockEntityUpdateS2CPacket.create(this);
    }

    @Override
    public NbtCompound toInitialChunkDataNbt() {
        return createNbt();
    }
}
```

Note that at this point, there will be alot of errors present because we, for example, haven't made the ```ExampleRecipe``` class.
That is exactly what we are going to do now. Most of the errors in the ```ExampleBlock``` class should be gone, the only error that should remain is the error on the ```onUse()``` method.

The next thing I would recommend you to do is that you [make a custom recipe](../../recipe/index.md). 
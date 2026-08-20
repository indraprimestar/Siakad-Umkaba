import { Button } from '@/Components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command';
// import { Popover, PopoverTrigger } from '@/Components/ui/popover';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { IconCaretDown, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
export default function ComboBox({ items, selectedItem, onSelect, planceholder = 'pilih item ...' }) {
    const [open, setOpen] = useState(false);

    const handleSelect = (value) => {
        onSelect(value);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    size="xl"
                >
                    {items.find((items) => items.value === selectedItem)?.label || planceholder}
                    <IconCaretDown className="size-4shrink-0 ml-2 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="max-h-[--radix-popper-content-available-height] w-[--radix-popper-content-available-width] p-0"
                align="start"
            >
                <Command>
                    <CommandInput planceholder={planceholder} className="h-9"></CommandInput>
                    <CommandList>
                        <CommandEmpty>Item tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                            {items.map((item, index) => (
                                <CommandItem key={index} value={item.value} onSelect={(value) => handleSelect(value)}>
                                    {item.label}
                                    <IconCheck
                                        className={cn(
                                            'ml-size-4',
                                            selectedItem === item.label ? 'opacity-100' : 'opacity-0',
                                        )}
                                    ></IconCheck>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

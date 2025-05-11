import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

import { Option } from "@/types/comboBox.ts";

interface ComboBoxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  type: ("assets" | "chains" | "reports");
}

const ComboBox: React.FC<ComboBoxProps> = ({ options, value, onChange, type }) => {
  const [open, setOpen] = useState<boolean>(false)

  const labelHelper = () => {
    if (type === "assets") return "Select Asset";
    if (type === "chains") return "Select Chain";
    if (type === "reports") return "Select Report";
  }

  const placeholderHelper = () => {
    if (type === "assets") return "Search Assets";
    if (type === "chains") return "Search Chains";
    if (type === "reports") return "Search Reports";
  }

  console.log(options.length, options);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-full w-full"
        >
          {value
            ? options.find((o) => o.value === value)?.label
            : labelHelper()}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-9 w-full p-0">
        <Command>
          <CommandInput placeholder={placeholderHelper()} className="h-9" />
          <CommandList>
            <CommandEmpty>No assets found.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.label}
                  onSelect={(currentValue) => {
                    const match = options.find(
                      (option) => option.label === currentValue
                    );
                    if (match) {
                      onChange(match.value);
                    }
                    setOpen(false)
                  }}
                >
                  {o.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === o.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboBox;
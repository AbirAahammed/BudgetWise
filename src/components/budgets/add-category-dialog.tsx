
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  PlusCircle, Package, Home, Car, Utensils, ShoppingCart, 
  HeartPulse, Ticket, GraduationCap, Gift, MoreHorizontal,
  Briefcase, DollarSign, PiggyBank, Coffee, Gamepad2,
  Music, Smartphone, Laptop, Shirt, Plane, Fuel,
  Zap, Wifi, Phone, CreditCard, Building
} from 'lucide-react';
import { useApp } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

// Available icons for categories
const availableIcons = [
  { value: 'Package', label: 'Package', icon: Package },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Car', label: 'Car', icon: Car },
  { value: 'Utensils', label: 'Food', icon: Utensils },
  { value: 'ShoppingCart', label: 'Shopping', icon: ShoppingCart },
  { value: 'HeartPulse', label: 'Health', icon: HeartPulse },
  { value: 'Ticket', label: 'Entertainment', icon: Ticket },
  { value: 'GraduationCap', label: 'Education', icon: GraduationCap },
  { value: 'Gift', label: 'Gifts', icon: Gift },
  { value: 'Briefcase', label: 'Work', icon: Briefcase },
  { value: 'DollarSign', label: 'Money', icon: DollarSign },
  { value: 'PiggyBank', label: 'Savings', icon: PiggyBank },
  { value: 'Coffee', label: 'Coffee', icon: Coffee },
  { value: 'Gamepad2', label: 'Gaming', icon: Gamepad2 },
  { value: 'Music', label: 'Music', icon: Music },
  { value: 'Smartphone', label: 'Phone', icon: Smartphone },
  { value: 'Laptop', label: 'Tech', icon: Laptop },
  { value: 'Shirt', label: 'Clothing', icon: Shirt },
  { value: 'Plane', label: 'Travel', icon: Plane },
  { value: 'Fuel', label: 'Gas', icon: Fuel },
  { value: 'Zap', label: 'Utilities', icon: Zap },
  { value: 'Wifi', label: 'Internet', icon: Wifi },
  { value: 'Phone', label: 'Bills', icon: Phone },
  { value: 'CreditCard', label: 'Finance', icon: CreditCard },
  { value: 'Building', label: 'Business', icon: Building },
  { value: 'MoreHorizontal', label: 'Other', icon: MoreHorizontal },
];

const formSchema = z.object({
  label: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
  icon: z.string().min(1, { message: 'Please select an icon.' }),
});

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [iconPopoverOpen, setIconPopoverOpen] = useState(false);
  const { addCategory } = useApp();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      icon: 'Package',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const categoryData = {
        ...data,
        value: data.label.toLowerCase().replace(/\s+/g, '-'), // Generate value from label
      };
      await addCategory(categoryData);
      form.reset();
      setOpen(false);
      toast({
        title: "Category added",
        description: "Your new category has been created successfully.",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get the icon component for display
  const getIconComponent = (iconValue: string) => {
    const iconData = availableIcons.find(icon => icon.value === iconValue);
    return iconData ? iconData.icon : Package;
  };

  const selectedIcon = form.watch('icon');
  const IconComponent = getIconComponent(selectedIcon);

  const handleIconSelect = (iconName: string) => {
    form.setValue('icon', iconName);
    setIconPopoverOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category for your expenses. Click the icon button to choose an icon.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <div className="flex gap-2">
                    {/* Icon Picker Button */}
                    <Popover open={iconPopoverOpen} onOpenChange={setIconPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" size="icon" className="shrink-0">
                          <IconComponent className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Choose an icon</h4>
                          <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                            {availableIcons.map((iconOption) => {
                              const Icon = iconOption.icon;
                              const isSelected = selectedIcon === iconOption.value;
                              return (
                                <Button
                                  key={iconOption.value}
                                  type="button"
                                  variant={isSelected ? "default" : "ghost"}
                                  size="icon"
                                  className={`h-8 w-8 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                                  onClick={() => handleIconSelect(iconOption.value)}
                                  title={iconOption.label}
                                >
                                  <Icon className="h-4 w-4" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <FormControl>
                      <Input placeholder="e.g. Subscriptions" {...field} className="flex-1" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Save Category</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

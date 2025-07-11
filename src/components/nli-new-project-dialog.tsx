
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, FolderPlus, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { regions } from '@/lib/thailand-data';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';


const projectSchema = z.object({
  projectName: z.string().min(3, { message: 'Project name must be at least 3 characters.' }),
  projectType: z.string({
    required_error: 'Please select a project type.',
  }),
  region: z.string({
    required_error: 'Please select a region.',
  }),
  provinces: z.array(z.string()).refine(value => value.length > 0, {
    message: 'You must select at least one province.',
  }),
  governmentBudget: z.coerce.number().min(0, { message: 'Budget must be a positive number.' }),
  startDate: z.date({
    required_error: 'A start date is required.',
  }),
  paybackPeriod: z.coerce.number().min(0, { message: 'Payback period must be a positive number.' }),
});

export function NewProjectDialog({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void; }) {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      governmentBudget: 0,
      paybackPeriod: 0,
      provinces: [],
    },
  });

  const selectedRegion = form.watch('region');

  React.useEffect(() => {
    form.setValue('provinces', []);
  }, [selectedRegion, form]);

  const provincesInRegion = React.useMemo(() => {
    if (!selectedRegion) return [];
    const regionData = regions.find(r => r.value === selectedRegion);
    return regionData ? regionData.provinces : [];
  }, [selectedRegion]);


  function onSubmit(values: z.infer<typeof projectSchema>) {
    // Here you would handle the form submission, e.g., send to an API
    console.log(values);
    onOpenChange(false); // Close the dialog on successful submission
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel text-foreground max-w-3xl p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FolderPlus className="text-primary" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Configure the settings for your new infrastructure project. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6">
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <FormField
                              control={form.control}
                              name="projectName"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Project Name</FormLabel>
                                  <FormControl>
                                      <Input placeholder="e.g., Eastern High-Speed Rail" {...field} className="bg-background/50"/>
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                            control={form.control}
                            name="projectType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-background/50">
                                      <SelectValue placeholder="Select a project type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="government">Government</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Region</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-background/50">
                                      <SelectValue placeholder="Select a region" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {regions.map((region) => (
                                      <SelectItem key={region.value} value={region.value}>{region.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                              control={form.control}
                              name="provinces"
                              render={({ field }) => (
                              <FormItem className="flex flex-col">
                                  <FormLabel>Provinces</FormLabel>
                                  <Popover>
                                  <PopoverTrigger asChild>
                                      <FormControl>
                                      <Button
                                          variant="outline"
                                          role="combobox"
                                          className={cn(
                                          "w-full justify-between bg-background/50 h-10",
                                          !field.value?.length && "text-muted-foreground"
                                          )}
                                          disabled={!selectedRegion}
                                      >
                                          <div className="flex gap-1 flex-wrap">
                                          {field.value && field.value.length > 0 ? (
                                              field.value.map(val => (
                                                  <Badge key={val} variant="secondary" className="mr-1">
                                                      {provincesInRegion.find(p => p.value === val)?.name}
                                                  </Badge>
                                              ))
                                          ) : (
                                              "Select provinces..."
                                          )}
                                          </div>
                                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                      </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                      <Command>
                                      <CommandInput placeholder="Search provinces..." />
                                      <CommandEmpty>No province found.</CommandEmpty>
                                      <CommandGroup>
                                        <ScrollArea className="h-48">
                                          {provincesInRegion.map((province) => (
                                          <CommandItem
                                              value={province.name}
                                              key={province.value}
                                              onSelect={(e) => {
                                                e.preventDefault(); // This is the fix
                                                const currentValues = field.value || [];
                                                const isSelected = currentValues.includes(province.value);
                                                const newValues = isSelected
                                                  ? currentValues.filter(v => v !== province.value)
                                                  : [...currentValues, province.value];
                                                field.onChange(newValues);
                                              }}
                                          >
                                              <Check
                                              className={cn(
                                                  "mr-2 h-4 w-4",
                                                  field.value && field.value.includes(province.value) ? "opacity-100" : "opacity-0"
                                              )}
                                              />
                                              {province.name}
                                          </CommandItem>
                                          ))}
                                        </ScrollArea>
                                      </CommandGroup>
                                      </Command>
                                  </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <FormField
                              control={form.control}
                              name="governmentBudget"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Gov. Budget (Billion THB)</FormLabel>
                                  <FormControl>
                                      <Input type="number" placeholder="150" {...field} className="bg-background/50"/>
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="paybackPeriod"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Payback Period (Years)</FormLabel>
                                  <FormControl>
                                      <Input type="number" placeholder="8" {...field} className="bg-background/50"/>
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                           <FormField
                              control={form.control}
                              name="startDate"
                              render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                      <FormLabel>Project Start Date</FormLabel>
                                      <Popover>
                                          <PopoverTrigger asChild>
                                          <FormControl>
                                              <Button
                                              variant={"outline"}
                                              className={cn(
                                                  "w-full justify-start text-left font-normal bg-background/50",
                                                  !field.value && "text-muted-foreground"
                                              )}
                                              >
                                              <CalendarIcon className="mr-2 h-4 w-4" />
                                              {field.value ? (
                                                  format(field.value, "PPP")
                                              ) : (
                                                  <span>Pick a date</span>
                                              )}
                                              </Button>
                                          </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                              mode="single"
                                              selected={field.value}
                                              onSelect={field.onChange}
                                              disabled={(date) =>
                                                  date > new Date() || date < new Date("1900-01-01")
                                              }
                                              initialFocus
                                          />
                                          </PopoverContent>
                                      </Popover>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                       </div>
                  </div>
                </ScrollArea>
                
                <DialogFooter className="pt-6 mt-4 border-t border-border">
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Create Project</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

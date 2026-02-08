import React, { useState } from "react";
import { Address } from "@/lib/types/type";
import { useAddOrUpdateAddressMutation, useGetAddressQuery } from "@/store/api";
import z, * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PiNotePencil, PiNotePencilLight } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    addresses: Address[];
  };
}

//schema used for showing error messages
const addressFormSchema = z.object({
  phoneNumber: z
    .string()
    .min(11, "Phone number must be at least 11 characters"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City name must be at least 2 character"),
  state: z.string().min(2, "State name must be at least 2 character"),
  postalCode: z.string().min(4, "Postal code must be at least 4 digits"),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface CheckoutAddressProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({
  onAddressSelect,
  selectedAddressId,
}) => {
  const { data: addressData, isLoading } = useGetAddressQuery() as {
    data: AddressResponse | undefined;
    isLoading: boolean;
  };

  const [addOrUpdateAddress] = useAddOrUpdateAddressMutation();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const addresses = addressData?.data?.addresses || [];

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    form.reset(address);
    setShowAddressForm(true);
  };

  const onSubmit = async (data: AddressFormValues) => {
    try {
      let result;
      if (editingAddress) {
        const updateAddress = {
          ...editingAddress,
          ...data,
          addressId: editingAddress._id,
        };
        result = await addOrUpdateAddress(updateAddress).unwrap();
      } else {
        result = await addOrUpdateAddress(data).unwrap();
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {addresses.map((addreess: Address) => (
          <Card
            key={addreess._id}
            className={`relative rounded-[16px] border-none transition-all duration-300 overflow-hidden cursor-pointer backdrop-blur-[10px] shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)]
            ${
              selectedAddressId === addreess._id
                ? "bg-black/30 border-none shadow-[0_5px_25px_5px_rgba(0,0,0,0.2)] 0_5px_25px_5px_rgba(0,0,0,0.3)"
                : "bg-black/30 border-none shadow-[0_5px_25px_5px_rgba(0,0,0,0.2)] 0_5px_25px_5px_rgba(0,0,0,0.3) hover:bg-black/60"
            }`}
            onClick={() => onAddressSelect(addreess)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <Checkbox
                  checked={selectedAddressId === addreess._id}
                  onCheckedChange={() => onAddressSelect(addreess)}
                  className="w-5 h-5 border-white/30 data-[state=checked]:bg-white/60 data-[state=checked]:text-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center justify-center">
                  <Button
                    size="icon"
                    className="text-white hover:bg-transparent shadow-none bg-transparent cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(addreess);
                    }}
                  >
                    <PiNotePencil className="size-6" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5 px-1">
                <p className="font-bold text-white text-base tracking-wide">
                  {addreess?.state}
                </p>
                <div className="text-sm text-white/80 leading-relaxed font-medium">
                  <p>{addreess?.addressLine1}</p>
                  {addreess?.addressLine2 && <p>{addreess.addressLine2}</p>}
                  <p>
                    {addreess?.city}, {addreess?.state} {addreess.postalCode}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-sm font-bold text-white flex items-center">
                    <span className="text-white font-medium mr-2 text-[12px] uppercase tracking-widest">
                      Phone:
                    </span>
                    {addreess.phoneNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogTrigger asChild>
          <Button
            className="w-full mt-4 bg-black/50 hover:bg-black/60 text-white border-none rounded-[12px] h-12 font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] transition-all duration-300 active:scale-[0.98] focus-visible:ring-0 focus-visible:ring-offset-0"
            variant="default"
          >
            <Plus className="w-5 h-5 mr-1 font-bold" />
            {editingAddress ? "Update This Address" : "Add New Address"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-6 bg-gray-500/20 backdrop-blur-[15px] border-none shadow-[0_10px_30px_0_rgba(0,0,0,0.3)] rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">
              {editingAddress ? "Edit Details" : "New Address"}
            </DialogTitle>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">
              Delivery requires accurate details.
            </p>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-bold uppercase text-[10px] tracking-widest">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide your 11-digits phone number"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white/50 placeholder:text-[12px] placeholder:text-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-bold uppercase text-[10px] tracking-widest">
                      Address Line 1
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide your address (house no, road no, street)"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white/50 placeholder:text-[12px] placeholder:text-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-bold uppercase text-[10px] tracking-widest">
                      Address Line 2 (optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="optional (apartment, building, floor/unit...)"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white/50 placeholder:text-[12px] placeholder:text-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 font-bold uppercase text-[10px] tracking-widest">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your city name"
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white/50 placeholder:text-[12px] placeholder:text-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 font-bold uppercase text-[10px] tracking-widest">
                        State
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your state name"
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white/50 placeholder:text-[12px] placeholder:text-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 font-bold uppercase text-[10px] tracking-widest">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Specify your postal code"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white/50 placeholder:text-[12px] placeholder:text-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutAddress;

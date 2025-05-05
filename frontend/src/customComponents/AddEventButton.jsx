import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ImageUploadField from "./ImageUploadFiled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import api from "../lib/api";

const AddEventButton = ({ isEdit, eventData }) => {
  const queryClient = useQueryClient();
  // state
  const [open, setOpen] = useState(false);

  // form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventName: "",
      eventDate: "",
      eventImage: null,
      eventCategory: "",
    },
  });

  // life cycle
  useEffect(() => {
    if (isEdit && eventData) {
      const loadImageAsFile = async () => {
        let imageFile = null;

        if (eventData.eventImage) {
          const response = await fetch(eventData.eventImage);
          const blob = await response.blob();
          imageFile = new File([blob], "existing-image.jpg", {
            type: blob.type,
          });
        }

        reset({
          eventName: eventData.eventName || "",
          eventDate: eventData.eventDate || "",
          eventImage: imageFile,
          eventCategory: eventData.eventCategory || "",
        });
      };

      loadImageAsFile();
    }

    return () => {
      reset({
        eventName: "",
        eventDate: "",
        eventImage: null,
        eventCategory: "",
      });
    };
  }, [isEdit, eventData, reset]);

  // api call
  const { isPending, mutate } = useMutation({
    mutationKey: ["createEvent"],
    mutationFn: async (payload) => {
      const response = await api.post("events", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success("Event Successfully created!");
        reset(); // Reset the form after submission
        setOpen(false); // Close dialog after submission
        queryClient.refetchQueries(["getEvents"]);
      }
    },
    onError: (errors) => {
      toast.error(errors?.response?.data?.message || errors.message);
    },
  });

  const { isPending: isEditing, mutate: editMutate } = useMutation({
    mutationKey: ["editEvent"],
    mutationFn: async (payload) => {
      const response = await api.patch(`events/${eventData?._id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success("Event Successfully Edited!");
        reset(); // Reset the form after submission
        setOpen(false); // Close dialog after submission
        queryClient.refetchQueries(["getEvents"]);
      }
    },
    onError: (errors) => {
      toast.error(errors?.response?.data?.message || errors.message);
    },
  });

  // functions
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("eventName", data.eventName);
    formData.append("eventDate", data.eventDate);
    formData.append("eventCategory", data.eventCategory);
    formData.append("eventImage", data.eventImage);
    if (isEdit) editMutate(formData);
    else mutate(formData);
  };

  const handleClose = () => {
    reset(); // Reset form when dialog closes
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Edit size={18} className="text-blue-500 cursor-pointer" />
        ) : (
          <Button className="bg-gradient-to-r from-orange-600 to-orange-300 text-white hover:opacity-90 ml-auto">
            + Add New Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col max-h-screen">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEdit ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-grow px-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ImageUploadField
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />

            <div className="grid gap-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                {...register("eventName", {
                  required: "Event name is required",
                })}
                placeholder="Enter event name"
              />
              {errors.eventName && (
                <p className="text-sm text-red-500">
                  {errors.eventName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                {...register("eventDate", {
                  required: "Event date is required",
                })}
              />
              {errors.eventDate && (
                <p className="text-sm text-red-500">
                  {errors.eventDate.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="eventCategory">Event Category</Label>

              <Controller
                name="eventCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...register("eventCategory", {
                      required: "Event Category is required",
                    })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="singingConcert">
                          Singing Concert
                        </SelectItem>
                        <SelectItem value="dancePerformance">
                          Dance Performance
                        </SelectItem>
                        <SelectItem value="standupComedy">
                          Standup Comedy
                        </SelectItem>
                        <SelectItem value="movieShow">Movie Show</SelectItem>
                        <SelectItem value="magicShow">Magic Show</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.eventCategory && (
                <p className="text-sm text-red-500">
                  {errors.eventCategory.message}
                </p>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isEdit ? isEditing : isPending}
                className="bg-gradient-to-r from-orange-600 to-orange-300 text-white hover:opacity-90"
              >
                {isEdit ? "Save Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventButton;

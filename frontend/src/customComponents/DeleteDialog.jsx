import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import img from "../../public/images/Frame32.png";

const DeleteDialog = ({ handleDeleteEvent, id }) => {
  // state
  const [open, setOpen] = useState(false);

  const clickDelete = () => {
    handleDeleteEvent(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 size={18} className="text-blue-500 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete ?</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to delete this event ?</p>
        </div>
        <div className="flex justify-center">
          <img src={img} alt="Confirmation illustration" />
        </div>
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={clickDelete}
            className="bg-gradient-to-r from-orange-600 to-orange-300 text-white hover:opacity-90"
          >
            Delete Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;

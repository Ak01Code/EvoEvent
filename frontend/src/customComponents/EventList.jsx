import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import AddEventButton from "./AddEventButton";
import DeleteDialog from "./DeleteDialog";
import { formatDate } from "../utils/dateUtils";
import { Pagination } from "./Pagination";

const EventList = ({ data, handleDeleteEvent, handlePageChange }) => {
  return (
    <div className="w-full p-4 bg-white rounded-md min-h-[74vh] flex flex-col">
      <div className="flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((event) => (
              <TableRow key={event._id}>
                <TableCell className="flex items-center gap-3 ">
                  <Avatar className="h-10 w-10 rounded-md">
                    <img
                      src={event.eventImage}
                      alt={event.name}
                      loading="lazy"
                      className="object-cover"
                    />
                  </Avatar>
                  <span className="font-medium">{event.eventName}</span>
                </TableCell>
                <TableCell className="text-left">
                  {formatDate(event.eventDate)}
                </TableCell>
                <TableCell className="text-left">
                  {event.eventCategory}
                </TableCell>
                <TableCell className="flex gap-3">
                  <DeleteDialog
                    handleDeleteEvent={handleDeleteEvent}
                    id={event?._id}
                  />
                  <AddEventButton isEdit={true} eventData={event} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full mt-auto pt-2 border-t">
        {data?.data?.length > 0 && (
          <Pagination
            hasNextPage={data?.meta?.hasNextPage}
            hasPreviousPage={data?.meta?.hasPreviousPage}
            limit={data?.meta?.limit}
            page={data?.meta?.page}
            total={data?.meta?.total}
            totalPages={data?.meta?.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};
export default EventList;

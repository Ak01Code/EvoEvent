import { Calendar } from "lucide-react";
import AddEventButton from "./AddEventButton";
import DeleteDialog from "./DeleteDialog";
import { formatDate } from "../utils/dateUtils";

const EventCard = ({
  eventName,
  eventImage,
  eventDate,
  eventCategory,
  _id,
  handleDeleteEvent,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-2">
      {/* Image Section */}
      <div className="h-48 bg-gray-200 relative mb-1">
        <img
          src={eventImage}
          alt="Chad profile"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="px-1">
        {/* Name and Action Buttons Row */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{eventName}</h3>
          <div className="flex space-x-2">
            <AddEventButton
              isEdit={true}
              eventData={{
                eventCategory,
                eventDate,
                eventImage,
                eventName,
                _id,
              }}
            />
            <DeleteDialog handleDeleteEvent={handleDeleteEvent} id={_id} />
          </div>
        </div>

        {/* Type and Date Row */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">
            {eventCategory}
          </span>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(eventDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

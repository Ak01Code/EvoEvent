import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddEventButton from "../customComponents/AddEventButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCard from "../customComponents/EventCard";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Pagination } from "../customComponents/Pagination";
import EventList from "../customComponents/EventList";
import { Grid, List, ListFilter, Search, User } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { Skeleton } from "@/components/ui/skeleton";
import api from "../lib/api";

const Event = () => {
  const queryClient = useQueryClient();
  //state
  const [filter, setFilter] = useState({ search: "", category: "" });
  const [searchDebounce, setSearchDebounce] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [viewTypeCard, setViewTypeCard] = useState(true);

  // media query
  const smallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  //life cycle
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchDebounce(filter.search);
      setPagination((pre) => ({ ...pre, page: 1 }));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filter.search]);

  // api call
  const {
    data: eventData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getEvents", searchDebounce, pagination, filter.category],
    queryFn: async () => {
      let url = `events?page=${pagination.page}&limit=${9}`;
      if (searchDebounce) url += `&search=${searchDebounce}`;
      if (filter.category && filter.category !== "all")
        url += `&category=${filter.category}`;
      const response = await api.get(url);
      return response?.data;
    },
    refetchOnMount: true,
  });

  if (error) {
    toast.error(error?.response?.data?.message || error?.message);
  }

  const { mutate } = useMutation({
    mutationKey: ["deleteEvent"],
    mutationFn: async (id) => {
      const response = await api.delete(`events/${id}`);
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success("Event Successfully Deleted!");
        queryClient.refetchQueries(["getEvents"]);
      }
    },
    onError: (errors) => {
      toast.error(errors?.response?.data?.message || errors.message);
    },
  });

  // functions
  const handleDeleteEvent = (id) => {
    mutate(id);
  };

  const handlePageChange = (value) => {
    setPagination((pre) => ({ ...pre, page: value }));
  };

  const handleFilter = (value) => {
    setFilter((pre) => ({ ...pre, category: value }));
    setPagination((pre) => ({ ...pre, page: 1 }));
  };

  return (
    <div className="min-h-[97vh] flex flex-col gap-2 mt-1 mb-3">
      <Card className="py-1">
        <CardContent className="px-1">
          <div className="flex justify-between">
            <div>
              <p className="text-2xl">
                <span className="text-orange-600">Evo</span>
                <span className="text-orange-500 italic">Event</span>
              </p>
            </div>
            <div className="max-w-lg bg-white rounded-full p-1 flex items-center shadow-sm">
              <div className="flex items-center flex-1 relative h-5">
                <Search className="h-4 w-4 text-gray-400 absolute left-3" />
                <Input
                  type="text"
                  placeholder="Search here..."
                  className="pl-10 border-none h-10 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onChange={(e) =>
                    setFilter((pre) => ({ ...pre, search: e.target.value }))
                  }
                />
              </div>
              <div className="bg-gray-100 rounded-full p-1 mx-1">
                <User className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row justify-between items-center sm:justify-left">
        <div className="text-left sm:w-full flex flex-col justify-start self-start">
          <h2 className="text-xl font-semibold">Events</h2>
          <p>View and manage every events of the future.</p>
        </div>
        {eventData?.data?.length > 0 && (
          <div
            className={`flex gap-1 justify-end sm:justify-start ${
              smallScreen ? "w-full justify-start" : ""
            }`}
          >
            <Select value={filter.category} onValueChange={handleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    <>
                      <ListFilter size={16} />
                      {!smallScreen && (
                        <span className="text-black-600">Filter</span>
                      )}
                    </>
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="singingConcert">
                    Singing Concert
                  </SelectItem>
                  <SelectItem value="dancePerformance">
                    Dance Performance
                  </SelectItem>
                  <SelectItem value="standupComedy">Standup Comedy</SelectItem>
                  <SelectItem value="movieShow">Movie Show</SelectItem>
                  <SelectItem value="magicShow">Magic Show</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              className="bg-transparent hover:bg-transparent text-black border border-gray-600"
              onClick={() => setViewTypeCard(!viewTypeCard)}
            >
              {viewTypeCard ? (
                <>
                  <List size={16} />
                  {!smallScreen && <span>List View</span>}
                </>
              ) : (
                <>
                  <Grid size={16} />
                  {!smallScreen && <span>Card View</span>}
                </>
              )}
            </Button>

            <AddEventButton />
          </div>
        )}
      </div>
      {isLoading && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {new Array(3).fill(null)?.map(() => {
            return (
              <div className="flex flex-col space-y-3 p-2">
                <Skeleton className="h-40 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {eventData?.data?.length == 0 && (
        <div className="mt-5 w-full">
          <p className="w-64 m-auto text-gray-600 mb-1">
            {`${
              searchDebounce?.length > 0 ||
              (filter.category !== "all" && filter.category)
                ? "No events found ! try searching or filter with different word."
                : "No Event’s to show yet ! add new event here..."
            } `}
          </p>
          {!filter.search && (!filter.category || filter.category == "all") && (
            <AddEventButton />
          )}
        </div>
      )}

      {viewTypeCard ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {eventData?.data?.map((el) => {
            return (
              <EventCard
                key={el?._id}
                {...el}
                handleDeleteEvent={handleDeleteEvent}
              />
            );
          })}
        </div>
      ) : eventData?.data?.length > 0 ? (
        <EventList
          data={eventData}
          handleDeleteEvent={handleDeleteEvent}
          handlePageChange={handlePageChange}
        />
      ) : null}

      {eventData?.data?.length > 0 && viewTypeCard && (
        <Pagination
          hasNextPage={eventData?.meta?.hasNextPage}
          hasPreviousPage={eventData?.meta?.hasPreviousPage}
          limit={eventData?.meta?.limit}
          page={eventData?.meta?.page}
          total={eventData?.meta?.total}
          totalPages={eventData?.meta?.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Event;


import { Input } from "@/Shared/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/Shared/components/ui/select";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  locationSearch: string;
  handleLocationSearch: (value: string) => void;
  radius: string;
  setRadius: (value: string) => void;
}

export const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  locationSearch,
  handleLocationSearch,
  radius,
  setRadius
}: SearchFiltersProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Talent Directory</h1>
      <p className="text-muted-foreground">
        Find experienced event staff for your next event
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex-1 flex gap-4">
          <Input
            placeholder="Enter location..."
            value={locationSearch}
            onChange={(e) => handleLocationSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={radius} onValueChange={setRadius}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Within 10 miles</SelectItem>
              <SelectItem value="25">Within 25 miles</SelectItem>
              <SelectItem value="50">Within 50 miles</SelectItem>
              <SelectItem value="100">Within 100 miles</SelectItem>
              <SelectItem value="250">Within 250 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default function SearchBar({ search, setSearch }: any) {
  return (

    <div className="flex justify-end mt-2">

      <input
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

    </div>

  );
}
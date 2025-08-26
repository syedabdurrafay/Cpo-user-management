import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

export default function Employees() {
  const employees = [
    { id: 1, name: "John Doe", rank: "IG Sindh", badgeNo: "PHQ-001", status: "Active" },
    { id: 2, name: "Jane Smith", rank: "DIG", badgeNo: "PHQ-002", status: "Active" },
    { id: 3, name: "Robert Khan", rank: "SSP", badgeNo: "PHQ-003", status: "On Leave" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-policeDark">Employee Records</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
            />
          </div>
          <button className="bg-policeBlue text-white px-4 py-2 rounded-lg">
            + Add Employee
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Rank</th>
              <th className="text-left p-3">Badge No.</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{emp.id}</td>
                <td className="p-3 font-medium">{emp.name}</td>
                <td className="p-3">{emp.rank}</td>
                <td className="p-3">{emp.badgeNo}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    emp.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
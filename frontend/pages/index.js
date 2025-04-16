import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [sortByTotalDeal, setSortByTotalDeal] = useState(false);

  // fetch("http://localhost:8000/api/sales-reps")
  useEffect(() => {
    fetch("/api/sales-reps")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.salesReps || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  // const response = await fetch("http://localhost:8000/api/ai", {
  const handleAskQuestion = async () => {
    try {
        const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error in AI request:", error);
    }
  };

  const getTotalDealValue = (user) =>
    user.deals.reduce((sum, deal) => sum + deal.value, 0);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (selectedRegion !== "All") {
      result = result.filter((user) => user.region === selectedRegion);
    }
    if (sortByTotalDeal) {
      result.sort((a, b) => getTotalDealValue(b) - getTotalDealValue(a));
    }
    return result;
  }, [users, selectedRegion, sortByTotalDeal]);

  const regions = ["All", ...new Set(users.map((u) => u.region))];

  return (
    <div className="p-6 font-sans max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="mr-2 font-medium">Region:</label>
          <select
            className="border border-gray-300 rounded px-3 py-1"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByTotalDeal}
            onChange={(e) => setSortByTotalDeal(e.target.checked)}
          />
          <span>Sort by Total Deal Value</span>
        </label>
      </div>

      <div className="w-full h-80 mb-10">
        <ResponsiveContainer>
          <BarChart data={filteredUsers.map((user) => ({
            name: user.name,
            total: getTotalDealValue(user),
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Sales Representatives</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border border-gray-300 rounded-xl p-4 shadow bg-white"
              >
                <h3 className="text-xl font-semibold mb-1">{user.name} - {user.role}</h3>
                <p className="text-sm text-gray-600 mb-1">🌍 {user.region}</p>
                <p className="text-sm mb-2">💼 Skills: {user.skills.join(", ")}</p>
                <p className="text-sm mb-2">📊 Total Deals: ${getTotalDealValue(user).toLocaleString()}</p>

                <div className="mb-2">
                  <strong>Deals:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {user.deals.map((deal, i) => (
                      <li key={i}>
                        {deal.client}: ${deal.value.toLocaleString()} {deal.status === "Closed Won" ? "✅" : deal.status === "Closed Lost" ? "❌" : "⏳"}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Clients:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {user.clients.map((client, i) => (
                      <li key={i}>
                        {client.name} ({client.industry}) - {client.contact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Ask a Question (AI Feature)</h2>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Enter your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <button
            onClick={handleAskQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ask
          </button>
        </div>
        {answer && (
          <div className="mt-4 text-lg">
            <strong>AI Response:</strong> {answer}
          </div>
        )}
      </section>
    </div>
  );
}

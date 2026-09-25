import { useState } from "react";
import ListSection from './List'

function App() {
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const handleAnalyse = async () => {
    setLoading(true);
    setError("");
    setResult(null);
  
    try {
      const response = await fetch(

        `${import.meta.env.VITE_API_URL}/api/analyze`,
      
        {
      
          method: "POST",
      
          headers: {
      
            "Content-Type": "application/json",
      
          },
      
          body: JSON.stringify({
      
            mission: mission,
      
          }),
      
        }
      
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
  
      setResult(data);
  
    } catch (error) {
      console.error(error);
  
      setError(error.message);
  
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Mission Brief
          </h1>

          <p className="mt-3 text-gray-600">
            Turn messy ideas into clear, actionable missions.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <label
            htmlFor="mission"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Describe the mission
          </label>

          <textarea
            id="mission"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Describe your business idea, problem, or project..."
            rows={8}
            className="w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-900 outline-none transition focus:border-black"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyse}
              disabled={!mission.trim()|| loading}
              className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              
              {loading ? "Analysing..":"Anlyse Mission"}

            </button>
          </div>
          {result && (
            <>            <ListSection
            title="Known Facts"
            items={result.knownFacts}
          />
          
          <ListSection
            title="Assumptions"
            items={result.assumptions}
          />
          
          <ListSection
            title="Missing Information"
            items={result.missingInformation}
          />
          
          <ListSection
            title="Constraints"
            items={result.constraints}
          />
          
          <ListSection
            title="Risks"
            items={result.risks}
          />
          
          <ListSection
            title="Recommended Next Actions"
            items={result.recommendedNextActions}
          />
          
          <ListSection
            title="Approval Required"
            items={result.approvalRequired}
          />

<ListSection
            title="Confidence"
            items={result.confidence}
          />
  </>

)}

        </div>
      </div>
    </main>
  );
}

export default App;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KanbanBoards from "./components/KanbanBoards";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KanbanBoards />
    </QueryClientProvider>
  );
}

export default App;

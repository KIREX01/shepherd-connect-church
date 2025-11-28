import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const Tasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ title, user_id: user?.id }])
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
      setNewTask("");
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
  });

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    addTaskMutation.mutate(newTask);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            My To-Do List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
            <Button onClick={handleAddTask}>Add Task</Button>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <AnimatePresence>
              <motion.ul className="space-y-2">
                {filteredTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() =>
                        toggleTaskMutation.mutate({
                          id: task.id,
                          completed: !task.completed,
                        })
                      }
                      className="h-5 w-5"
                    />
                    <span
                      className={`flex-grow ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTaskMutation.mutate(task.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      &#x2715;
                    </Button>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Tasks;

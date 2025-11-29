import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tables } from "@/integrations/supabase/types";

type Task = Tables<"tasks">;

const Tasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState("");
  const [taskType, setTaskType] = useState<"personal" | "shared">("personal");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", user?.id, taskType],
    queryFn: async () => {
      let query = supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (taskType === "personal") {
        query = query.eq("task_type", "personal").eq("created_by", user?.id);
      } else {
        query = query.eq("task_type", "shared");
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!user,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ 
          title, 
          created_by: user?.id || "",
          task_type: taskType,
          status: "pending"
        }])
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id, taskType] });
      setNewTask("");
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const newStatus = status === "completed" ? "pending" : "completed";
      const { data, error } = await supabase
        .from("tasks")
        .update({ 
          status: newStatus,
          completed_at: newStatus === "completed" ? new Date().toISOString() : null
        })
        .eq("id", id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id, taskType] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id, taskType] });
    },
  });

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    addTaskMutation.mutate(newTask);
  };

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 py-8"
      >
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Task Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={taskType} onValueChange={(v) => setTaskType(v as "personal" | "shared")} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Tasks</TabsTrigger>
                <TabsTrigger value="shared">Shared Tasks</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 mb-6">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
              />
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-6">
                {/* Pending Tasks */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Pending ({pendingTasks.length})
                  </h3>
                  <AnimatePresence>
                    <motion.ul className="space-y-2">
                      {pendingTasks.map((task) => (
                        <motion.li
                          key={task.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                          className="flex items-center gap-2 p-3 rounded-md border bg-card transition-colors hover:bg-muted"
                        >
                          <Checkbox
                            checked={false}
                            onCheckedChange={() =>
                              toggleTaskMutation.mutate({
                                id: task.id,
                                status: task.status,
                              })
                            }
                            className="h-5 w-5"
                          />
                          <span className="flex-grow">{task.title}</span>
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
                  {pendingTasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No pending tasks
                    </p>
                  )}
                </div>

                {/* Completed Tasks */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Completed ({completedTasks.length})
                  </h3>
                  <AnimatePresence>
                    <motion.ul className="space-y-2">
                      {completedTasks.map((task) => (
                        <motion.li
                          key={task.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                          className="flex items-center gap-2 p-3 rounded-md border bg-card transition-colors hover:bg-muted"
                        >
                          <Checkbox
                            checked={true}
                            onCheckedChange={() =>
                              toggleTaskMutation.mutate({
                                id: task.id,
                                status: task.status,
                              })
                            }
                            className="h-5 w-5"
                          />
                          <span className="flex-grow line-through text-muted-foreground">
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
                  {completedTasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No completed tasks
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Tasks;

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Calendar, Trash2, Search, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { getMeetings, deleteMeeting, Meeting } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MeetingHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true)
        const data = await getMeetings()
        setMeetings(data)
      } catch (err) {
        setError("Failed to load meeting history. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMeetings()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteMeeting(id);
      setMeetings(meetings.filter(m => m.id !== id));
      toast({
        title: "Success",
        description: "Meeting has been deleted.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.notes.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderSkeleton = () =>
    [...Array(4)].map((_, i) => (
      <TableRow key={i}>
        <TableCell className="py-4">
          <Skeleton className="mb-2 h-4 w-48" />
          <Skeleton className="h-3 w-72 max-w-full" />
        </TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
        <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-24" /></TableCell>
      </TableRow>
    ))

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Meeting history</CardTitle>
            <CardDescription>View and manage your processed meeting recordings</CardDescription>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              aria-label="Search meetings"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full pl-9 text-sm sm:w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="h-10 pl-5 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:pl-6">Meeting</TableHead>
              <TableHead className="h-10 text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</TableHead>
              <TableHead className="h-10 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="h-10 pr-5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground sm:pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeleton()
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-destructive">{error}</TableCell>
              </TableRow>
            ) : filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting, index) => (
                <motion.tr
                  key={meeting.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.03 }}
                  className="group border-b transition-colors last:border-0 hover:bg-muted/40"
                >
                  <TableCell className="max-w-[320px] py-4 pl-5 sm:pl-6">
                    <div className="truncate font-medium">{meeting.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{meeting.notes.substring(0, 100)}...</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(meeting.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="border-transparent bg-success/10 text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Completed
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right sm:pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/meeting/${meeting.id}`}>
                          View notes
                          <ArrowUpRight />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Delete meeting"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the meeting and its associated notes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(meeting.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="py-14">
                  <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold">No meetings found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms." : "Upload your first meeting recording to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

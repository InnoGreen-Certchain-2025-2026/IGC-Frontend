import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const requests = [
    { user: "Nguyen Van A", cert: "Professional Scrum Master", date: "2 hours ago", status: "Review" },
    { user: "Tran Thi B", cert: "Node.js Advanced", date: "5 hours ago", status: "Review" },
    { user: "Le Van C", cert: "Cloud Architect", date: "Yesterday", status: "Review" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-gray-500">IGC Certificate Issuance Platform</p>
        </div>
        <Button className="bg-blue-600">Issue New Certificate</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Issued", value: "1,284" },
          { label: "Pending Review", value: "12" },
          { label: "Active Users", value: "856" },
          { label: "Blockchain Tx", value: "3,412" }
        ].map((stat, i) => (
          <Card key={i} className="bg-blue-600 text-white border-none shadow-md shadow-blue-200">
            <CardHeader className="py-4">
              <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-blue-50">
        <CardHeader>
          <CardTitle>Recent Issuance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{req.user}</TableCell>
                  <TableCell>{req.cert}</TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-100 hover:bg-blue-50">Approve</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

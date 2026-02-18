"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ProfileContentCard from "../../../_components/profile-content-card";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const DocumentTable = () => {
  const { user } = useAuth();
  const documents = user?.data?.documents || [];
  const filteredDocuments = documents.filter(
    (doc) => (doc.type as unknown as string) === "OTHER",
  );
  console.log(filteredDocuments);

  const MySwal = withReactContent(Swal);

  const handleDelete = (docId: string) => {
    MySwal.fire({
      title: <p>Are you sure you want to delete this document?</p>,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete API or perform the delete action
        MySwal.fire(<p>Document deleted successfully!</p>);
      }
    });
  };

  return (
    <div className="mt-10">
      <ProfileContentCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Document No</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Issue Authority</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc, index) => (
              <TableRow key={doc.id}>
                <TableCell className="text-muted-foreground font-medium">
                  {index + 1}
                </TableCell>
                <TableCell>{doc.id}</TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.documentNo}</TableCell>
                <TableCell>{doc.issueDate}</TableCell>
                <TableCell>{doc.issueAuthority}</TableCell>
                <TableCell>
                  {doc.remarks ? doc.remarks : "No remarks"}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
         
                    >
                      <Eye className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-8 w-8"
                      onClick={() => handleDelete(doc.id)}
                      aria-label={`Delete ${doc.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ProfileContentCard>
    </div>
  );
};

export default DocumentTable;

import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";

type Props = {
    metadata: MetaData;
    onPageChange: (page: number) => void;
}

export default function AppPagination({ metadata, onPageChange }: Props) {
    const {currentPage, totalCount, totalPages, pageSize} = metadata;
    return (
        <Box display='flex' justifyContent ='space-between' alignItems='center'>
          <Typography>
            Displaying {(currentPage-1)*pageSize+1}-
            {currentPage*pageSize > totalCount 
            ? totalCount : currentPage*pageSize} of {totalCount} items
          </Typography>
          <Pagination 
            color ='secondary' 
            size='large' 
            count={totalPages} 
            page={currentPage}
            onChange={(e, page) => onPageChange(page)}
            />
        </Box>
    )
}
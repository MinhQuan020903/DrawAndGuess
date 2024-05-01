import { Box } from "@chakra-ui/react"
import moment from "moment"

export default function Timestamp ( { timestamp, annotation }){

    return(
        <Box 
            color='gray.500'
            letterSpacing='wide'
            fontSize={'11px'}
            >
            {annotation + ' ' + moment(timestamp.toDate()).calendar()}
        </Box>
    )
}
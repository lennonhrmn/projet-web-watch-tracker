import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useDeleteComment = () => {
    const deleteComment = async (commentId: string) => {
        const response = await fetch(`/api/deleteComment`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentId })
        });
        return response;
    }

    return {
        deleteComment,
    };
}

export default useDeleteComment;
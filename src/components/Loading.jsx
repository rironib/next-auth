import {Spinner} from "@heroui/react";

const Loading = () => {
    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-10 flex justify-center items-center h-[100dvh] bg-default-50">
            <Spinner/>
        </div>
    );
};

export default Loading;
import Dashboard from "@/src/modules/dashboard";
import Form from "@/src/modules/form";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {
    return (
        <>
            <ProtectedRoute auth={true}>
                <div className="bg-[#e1e7f2] h-screen flex justify-center items-center">
                    <Dashboard />
                </div>
            </ProtectedRoute>
        </>
    );
}

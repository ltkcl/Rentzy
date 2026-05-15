import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "The page could not load.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      error.data?.message ||
      "The route loader failed while fetching data from the backend.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-lg border border-blue-100 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-3">
          Rentily Data Error
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{title}</h1>
        <p className="text-slate-600 leading-relaxed mb-6">{message}</p>
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700">
          If this mentions database connectivity, make sure the backend is running and that `backend/.env`
          points to a reachable Postgres instance.
        </div>
      </div>
    </div>
  );
}

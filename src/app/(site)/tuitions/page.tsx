import { Suspense } from "react";
import PageTitle from "@/components/ui/PageTitle";
import TuitionsBrowser from "@/components/tuition/TuitionsBrowser";
import { Spinner } from "@/components/ui/Loader";

export default function TuitionsPage() {
  return (
    <>
      <PageTitle title="Browse Tuitions" />
      <section className="bg-base-200">
        <div className="container-x py-12">
          <p className="section-eyebrow">Browse</p>
          <h1 className="section-title mt-3">Find the right tuition</h1>
          <p className="section-lead">
            Only admin-approved and active batches are listed. Search by title or subject and filter
            by class level and mode.
          </p>
        </div>
      </section>

      <div className="container-x py-10">
        <Suspense fallback={<Spinner />}>
          <TuitionsBrowser />
        </Suspense>
      </div>
    </>
  );
}

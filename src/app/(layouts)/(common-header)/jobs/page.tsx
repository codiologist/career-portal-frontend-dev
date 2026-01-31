import JobCard from "@/app/features/job/job-card";

const JobPage = () => {
  return (
    <div className="">
      <section className="relative table w-full bg-[url('/job-listing-bg.jpg')] bg-cover bg-top bg-no-repeat py-36">
        <div className="bg-primary/70 absolute inset-0"></div>
        <div className="relative container">
          <div className="mt-10 grid grid-cols-1 text-center">
            <h3 className="text-2xl leading-snug font-bold tracking-wide text-white uppercase md:text-5xl md:leading-snug">
              Open Positions
            </h3>
          </div>
        </div>
      </section>
      <div className="relative">
        <div className="shape absolute start-0 end-0 -bottom-0.5 z-1 overflow-hidden text-white sm:-bottom-px dark:text-slate-900">
          <svg
            className="h-auto w-full"
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <section className="relative py-16 md:py-24">
        <div className="container-lg">
          <div className="grid grid-cols-1 gap-7.5">
            <JobCard />
            <JobCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobPage;

function HomePage() {
  return (
    <>
      <section className="bg-light rounded-4 p-5 mb-4">
        <div className="row align-items-center">
          <div className="col-md-7">
            <h1 className="fw-bold">
              Welcome to PIN Shelter
            </h1>

            <p className="lead text-muted">
              Information system for managing abandoned animals, adopters and adoptions.
            </p>

            <a href="/animals" className="btn btn-success btn-lg">
              View Animals
            </a>
          </div>

          <div className="col-md-5 text-center">
            <i className="fa-solid fa-paw display-1 text-success"></i>
          </div>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Animals</h5>
              <p className="text-muted">
                Browse dogs and cats waiting for a home.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Adoptions</h5>
              <p className="text-muted">
                Registered users can apply for animal adoption.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Statistics</h5>
              <p className="text-muted">
                View shelter statistics and adoption overview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
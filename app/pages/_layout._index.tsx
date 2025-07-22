import { Link } from "react-router";
import PageTitle from "~/components/PageTitle";


/**
 * HomePage component for the HRNet application.
 * Displays a welcome message and navigation cards for adding and managing employees.
 */
const HomePage = () => {
	return (
		<>
	  <PageTitle title="Home" description="HRNet employee management application" />
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<div className="card">
							<div className="card-body">
								<div className="text-center">
				  <h1 className="display-4 text-primary mb-4">
					<i className="bi bi-people-fill me-3"></i>
					Welcome to HRNet
				  </h1>
									<p className="lead mb-4">
					Your modern and efficient employee management application
									</p>
									<div className="row g-4 mt-4">
										<div className="col-md-4">
											<div className="card border-primary">
												<div className="card-body text-center">
													<i className="bi bi-person-plus display-1 text-primary mb-3"></i>
						<h2 className="card-title h5">Add employees</h2>
													<p className="card-text">
							Easily create new employee profiles with all the necessary information.
													</p>
													<Link to="/employees/add" className="btn btn-primary">
							Add employee
													</Link>
												</div>
											</div>
										</div>
										<div className="col-md-4">
											<div className="card border-success">
												<div className="card-body text-center">
													<i className="bi bi-list-ul display-1 text-success mb-3"></i>
						<h2 className="card-title h5">Manage employees</h2>
													<p className="card-text">
							View, search and edit your employees' information.
													</p>
													<Link to="/employees" className="btn btn-success">
							Employee list
													</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;

import { Link } from "react-router";
import PageTitle from "~/components/PageTitle";


/**
 * HomePage component for the HRNet application.
 * Displays a welcome message and navigation cards for adding and managing employees.
 */
const HomePage = () => {
	return (
		<>
			<PageTitle title="Accueil" description="Application de gestion des employés HRNet" />
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<div className="card">
							<div className="card-body">
								<div className="text-center">
									<h1 className="display-4 text-primary mb-4">
										<i className="bi bi-people-fill me-3"></i>
										Bienvenue sur HRNet
									</h1>
									<p className="lead mb-4">
										Votre application de gestion des employés moderne et efficace
									</p>
									<div className="row g-4 mt-4">
										<div className="col-md-4">
											<div className="card border-primary">
												<div className="card-body text-center">
													<i className="bi bi-person-plus display-1 text-primary mb-3"></i>
													<h5 className="card-title">Ajouter des employés</h5>
													<p className="card-text">
														Créez facilement de nouveaux profils d'employés avec toutes les
														informations nécessaires.
													</p>
													<Link to="/employees/add" className="btn btn-primary">
														Ajouter un employé
													</Link>
												</div>
											</div>
										</div>
										<div className="col-md-4">
											<div className="card border-success">
												<div className="card-body text-center">
													<i className="bi bi-list-ul display-1 text-success mb-3"></i>
													<h5 className="card-title">Gérer les employés</h5>
													<p className="card-text">
														Consultez, recherchez et modifiez les informations de vos employés.
													</p>
													<Link to="/employees" className="btn btn-success">
														Liste des employés
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

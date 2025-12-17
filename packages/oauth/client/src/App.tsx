import React, { useEffect, useState } from 'react';
import './App.css';

interface OAuthServiceInfo {
	name: string;
	displayName: string;
	clientIdLabel: string;
	clientSecretLabel: string;
	scopes: string[];
	setupInstructions: string;
}

function App() {
	const [services, setServices] = useState<OAuthServiceInfo[]>([]);
	const [selectedService, setSelectedService] = useState<string>('');
	const [clientId, setClientId] = useState<string>('');
	const [clientSecret, setClientSecret] = useState<string>('');
	const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		fetch('/api/services')
			.then((res) => res.json())
			.then((data) => {
				setServices(data);
				if (data.length > 0) {
					setSelectedService(data[0].name);
					setSelectedScopes(data[0].scopes);
				}
			})
			.catch((err) => {
				setError('Failed to load services');
				console.error(err);
			});
	}, []);

	const selectedServiceInfo = services.find((s) => s.name === selectedService);

	// Update selected scopes when service changes
	useEffect(() => {
		if (selectedServiceInfo) {
			setSelectedScopes(selectedServiceInfo.scopes);
		}
	}, [selectedService, selectedServiceInfo]);

	const handleScopeToggle = (scope: string) => {
		setSelectedScopes((prev) =>
			prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
		);
	};

	const handleSelectAllScopes = () => {
		if (selectedServiceInfo) {
			setSelectedScopes(selectedServiceInfo.scopes);
		}
	};

	const handleSelectNoneScopes = () => {
		setSelectedScopes([]);
	};

	const handleAuthenticate = async () => {
		if (!selectedService || !clientId || !clientSecret) {
			setError('Please fill in all fields');
			return;
		}

		if (selectedScopes.length === 0) {
			setError('Please select at least one scope');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					service: selectedService,
					clientId,
					clientSecret,
					scopes: selectedScopes,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Open auth URL in a popup window
			const popup = window.open(
				data.authUrl,
				'oauth',
				'width=600,height=700,scrollbars=yes,resizable=yes',
			);

			// Monitor popup for closure
			const checkClosed = setInterval(() => {
				if (popup?.closed) {
					clearInterval(checkClosed);
					setIsLoading(false);
					// Clear form for next use
					setClientId('');
					setClientSecret('');
				}
			}, 1000);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Authentication failed');
			setIsLoading(false);
		}
	};

	return (
		<div className="App">
			<div className="container">
				<div className="header">
					<h1>OAuth Token Helper</h1>
					<p className="subtitle">Get OAuth tokens for local development</p>
					{error && <div className="error">{error}</div>}
				</div>

				<div className="form-section">
					<div className="form-group">
						<label htmlFor="service-select">OAuth Service:</label>
						<select
							id="service-select"
							value={selectedService}
							onChange={(e) => setSelectedService(e.target.value)}
						>
							{services.map((service) => (
								<option key={service.name} value={service.name}>
									{service.displayName}
								</option>
							))}
						</select>
					</div>

					{selectedServiceInfo && (
						<>
							<div className="form-group">
								<label htmlFor="client-id">
									{selectedServiceInfo.clientIdLabel}:
								</label>
								<input
									id="client-id"
									type="text"
									value={clientId}
									onChange={(e) => setClientId(e.target.value)}
									placeholder={`Enter your ${selectedServiceInfo.clientIdLabel}`}
								/>
							</div>

							<div className="form-group">
								<label htmlFor="client-secret">
									{selectedServiceInfo.clientSecretLabel}:
								</label>
								<input
									id="client-secret"
									type="password"
									value={clientSecret}
									onChange={(e) => setClientSecret(e.target.value)}
									placeholder={`Enter your ${selectedServiceInfo.clientSecretLabel}`}
								/>
							</div>

							<div className="form-group">
								<label>OAuth Scopes:</label>
								<div className="scope-controls">
									<button
										type="button"
										onClick={handleSelectAllScopes}
										className="scope-control-button"
									>
										Select All
									</button>
									<button
										type="button"
										onClick={handleSelectNoneScopes}
										className="scope-control-button"
									>
										Select None
									</button>
									<span className="scope-count">
										{selectedScopes.length} of{' '}
										{selectedServiceInfo.scopes.length} selected
									</span>
								</div>
								<div className="scope-checklist">
									{selectedServiceInfo.scopes.map((scope) => (
										<label key={scope} className="scope-checkbox">
											<input
												type="checkbox"
												checked={selectedScopes.includes(scope)}
												onChange={() => handleScopeToggle(scope)}
											/>
											<span className="scope-name">{scope}</span>
										</label>
									))}
								</div>
							</div>

							<button
								onClick={handleAuthenticate}
								disabled={
									isLoading ||
									!clientId ||
									!clientSecret ||
									selectedScopes.length === 0
								}
								className="auth-button"
							>
								{isLoading ? 'Authenticating...' : 'Authenticate'}
							</button>
						</>
					)}
				</div>

				<div className="instructions-section">
					{selectedServiceInfo ? (
						<>
							<h3>Setup Instructions</h3>
							<div className="instructions-content">
								{selectedServiceInfo.setupInstructions
									.split('\n')
									.map((line, index) => (
										<React.Fragment key={index}>
											{line}
											{index <
												selectedServiceInfo.setupInstructions.split('\n').length -
													1 && <br />}
										</React.Fragment>
									))}
							</div>
						</>
					) : (
						<>
							<h3>Setup Instructions</h3>
							<div className="instructions-content">
								Select an OAuth service to see setup instructions.
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;

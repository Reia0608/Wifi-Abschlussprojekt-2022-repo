const apiBaseUrl = 'http://localhost:59968/api/';

const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];

const imgContainer = document.querySelector('#imgContainer');
const imgBild = document.querySelector('#imgBild');
const buttonBenutzerSpeichern = document.querySelector('#buttonBenutzerSpeichern');
const buttonBenutzerAbbrechen = document.querySelector('#buttonBenutzerAbbrechen');
const buttonPasswortAendern = document.querySelector('#buttonPasswortAendern');
const dialogPasswort = new bootstrap.Modal(modalPasswortBody);
const buttonModalPasswortSpeichern = document.querySelector('#buttonModalPasswortSpeichern');
const buttonFSKNeu = document.querySelector('#buttonFSKNeu');
const dialogFuehrerschein = new bootstrap.Modal(modalFSKBody);
const buttonModalFSKSpeichern = document.querySelector('#buttonModalFSKSpeichern');
const checkboxSwitchIstFahrer = document.querySelector('#checkboxSwitchIstFahrer');
const checkboxSwitchHatZugfahrzeug = document.querySelector('#checkboxSwitchHatZugfahrzeug');
const inputMarke = document.querySelector('#inputMarke');
const inputModell = document.querySelector('#inputModell');
const inputKennzeichen = document.querySelector('#inputKennzeichen');

this.checkboxAll = document.querySelector('#checkboxAll');

// Initialisierung
var benutzerBild = {};

if(benutzerMerkmal)
{
	datenLaden(benutzerMerkmal);
}
else
{
	alert('Kein Benutzer angemeldet!');
}

//-------------------------------------------------------------
// drag & drop Bild
imgContainer.addEventListener('dragover', (event) => 
{
	event.stopPropagation();
	event.preventDefault();
	event.dataTransfer.dropEffect = 'copy';
});

imgContainer.addEventListener('drop', (event) => 
{
	event.stopPropagation();
	event.preventDefault();
	const fileList = event.dataTransfer.files;
	this.bild = fileList[0];
	const reader = new FileReader();
	reader.addEventListener('load', (event) => 
	{
		// convert the image into a base64 string that can be saved as Byte[].
		let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
		benutzerBild.bild_bytes = base64String;

		imgBild.src = event.target.result;	
	});
	reader.readAsDataURL(fileList[0]);
});

//-------------------------------------------------------------
// Passwort ändern-click

buttonPasswortAendern.addEventListener('click', (e) => 
{
	labelAltesPasswort.classList.remove('is-invalid', 'is-valid');
	labelNeuesPasswort1.classList.remove('is-invalid', 'is-valid');
	labelNeuesPasswort2.classList.remove('is-invalid', 'is-valid');
	labelAltesPasswort.value = "";
	labelNeuesPasswort1.value = "";
	labelNeuesPasswort2.value = "";

	dialogPasswort.show();
});

//---------------------------
buttonModalPasswortSpeichern.addEventListener('click', (e) => 
{
	let saveOk = true;
	labelAltesPasswort.classList.remove('is-invalid', 'is-valid');
	labelNeuesPasswort1.classList.remove('is-invalid', 'is-valid');
	labelNeuesPasswort2.classList.remove('is-invalid', 'is-valid');

	if (!labelAltesPasswort.value) 
		{
			saveOk = false;
			labelAltesPasswort.classList.add('is-invalid');
		}
		else
		{
			labelAltesPasswort.classList.add('is-valid');
		} 

		if(!labelNeuesPasswort1.value || labelAltesPasswort.value == labelNeuesPasswort1.value)
		{
			saveOk = false;
			labelNeuesPasswort1.classList.add('is-invalid');
		}
		else
		{
			labelNeuesPasswort1.classList.add('is-valid');
		} 

		if (labelNeuesPasswort1.value != labelNeuesPasswort2.value) 
		{
			saveOk = false;
			labelNeuesPasswort2.classList.add('is-invalid');
		}
		else
		{
			labelNeuesPasswort2.classList.add('is-valid');
		} 

		ApiBenutzerCheck((response) => 
		{
			if(response.success == false)
			{
				saveOk = false;
				alert("falsches Passwort!");
			}
			else
			{
				if (saveOk) 
				{
					this.benutzer.passwort = labelNeuesPasswort1.value;

					// Update the database.
					ApiBenutzerSet(() => 
					{
						console.log("database was updated!");
					}, (ex) => 
					{
						alert(ex);
					}, this.benutzer);

					dialogPasswort.hide();
				}
			}
		}, (ex) => 
		{
			alert(ex);
		}, benutzerMerkmal);
});

//-------------------------------------------------------------
// Button-Führerscheinklassen-Hinzufügen/Entfernen-click

buttonFSKNeu.addEventListener( 'click', (e) => 
{
	ApiBenutzerGetFSKObject((response) => 
	{
		this.fuehrerscheinklassenlist = response;
		dialogFuehrerschein.show();

		// WIP check/ uncheck boxes in Modal
	}, (ex) => 
	{
		alert(ex);
	}, this.benutzer.userid);
});

// Button Modal Führerscheinklassen checkboxAll-click

this.checkboxAll.addEventListener('click', ()=>
{
	let checkboxCollection = document.querySelectorAll('#checkboxSelect');
	let selected = this.checkboxAll.checked;
	for(let checkbox of checkboxCollection) 
	{    
		checkbox.checked = selected; 
	}
});


//-------------------------------------------------------------
// Button-Modal-Führerscheinklassen-speichern-click

buttonModalFSKSpeichern.addEventListener( 'click', (e) => 
{
	let selectedFSKList = [];
	let checkboxCollection = document.querySelectorAll('#checkboxSelect');
	for(let checkbox of checkboxCollection) 
	{    
		if(checkbox.checked)
		{
			selectedFSKList.push(true);
		} 
		else
		{
			selectedFSKList.push(false);
		}
	}

	ApiBenutzerFSKAdd(() =>
	{
		this.datenLaden(benutzerMerkmal);
	}, (ex) =>
	{
		alert(ex);
	}, this.benutzer.userid ,selectedFSKList);

	dialogFuehrerschein.hide();
});

//-------------------------------------------------------------
// Checkbox-Switch-Ist-Fahrer-click
checkboxSwitchIstFahrer.addEventListener('click', (e) =>
{
	if(checkboxSwitchIstFahrer.checked == true)
	{
		this.benutzer.istfahrer = true;
		collapseFuehrerschein.classList.add("show");
	}
	else
	{
		this.benutzer.istfahrer = false;
		collapseFuehrerschein.classList.remove("show");
	}
});

//-------------------------------------------------------------
// Checkbox-Switch-Hat-Zugfahrzeug-click
checkboxSwitchHatZugfahrzeug.addEventListener('click', (e) =>
{
	if(checkboxSwitchHatZugfahrzeug.checked == true)
	{
		this.benutzer.hatzugfahrzeug = true;
		collapseZugfahrzeug.classList.add("show");
	}
	else
	{
		this.benutzer.hatzugfahrzeug = false;
		collapseZugfahrzeug.classList.remove("show");
	}
});

//-------------------------------------------------------------
// speichern

buttonBenutzerSpeichern.addEventListener('click', (e) => 
{
	const inputBenutzername = document.querySelector('#inputBenutzername');
	const inputVorname = document.querySelector('#inputVorname');
	const inputNachname = document.querySelector('#inputNachname');
	const inputDateGeburtsdatum = document.querySelector('#inputDateGeburtsdatum');
	const inputGeburtsort = document.querySelector('#inputGeburtsort');

	if (inputBenutzername.value && inputVorname.value && inputNachname.value) 
	{
		let saveOk = true;
		if(benutzerMerkmal)
		{
			this.benutzer.username = inputBenutzername.value;
			this.benutzer.vorname = inputVorname.value;
			this.benutzer.nachname = inputNachname.value;
			if(inputDateGeburtsdatum.value)
			{
				this.benutzer.geburtsdatum = inputDateGeburtsdatum.value;
			}
			this.benutzer.geburtsort = inputGeburtsort.value;
			
			if(checkboxSwitchIstFahrer.checked)
			{
				this.benutzer.istfahrer = true;

				if (selectStatus.value == '0') 
				{
					saveOk = false;
					selectStatus.classList.add('is-invalid');
					selectStatus.classList.remove('is-valid');
				}
				else 
				{
					selectStatus.classList.add('is-valid');
					selectStatus.classList.remove('is-invalid');
				}

				if(!inputDateAusstellung.value)
				{
					saveOk = false;
					inputDateAusstellung.classList.add('is-invalid');
					inputDateAusstellung.classList.remove('is-valid');
				}
				else
				{
					inputDateAusstellung.classList.add('is-valid');
					inputDateAusstellung.classList.remove('is-invalid');
				}

				if(!inputDateAblauf.value)
				{
					saveOk = false;
					inputDateAblauf.classList.add('is-invalid');
					inputDateAblauf.classList.remove('is-valid');
				}
				else
				{
					inputDateAblauf.classList.add('is-valid');
					inputDateAblauf.classList.remove('is-invalid');
				}

				if(!inputFuehrerscheinnummer.value)
				{
					saveOk = false;
					inputFuehrerscheinnummer.classList.add('is-invalid');
					inputFuehrerscheinnummer.classList.remove('is-valid');
				}
				else
				{
					inputFuehrerscheinnummer.classList.add('is-valid');
					inputFuehrerscheinnummer.classList.remove('is-invalid');
				}

				if(saveOk)
				{
					this.benutzer.status = parseInt(selectStatus.value);
					if(inputDateAusstellung.value)
					{
						this.benutzer.fuehrerscheinausstellungsdatum = inputDateAusstellung.value;
					}
					if(inputDateAblauf.value)
					{
						this.benutzer.fuehrerscheinablaufdatum = inputDateAblauf.value;
					}
					this.benutzer.fuehrerscheinnummer = inputFuehrerscheinnummer.value;
				}
			}

			if(checkboxSwitchHatZugfahrzeug.checked)
			{
				this.benutzer.hatzugfahrzeug = true;

				if (!inputMarke.value) 
				{
					saveOk = false;
					inputMarke.classList.add('is-invalid');
					inputMarke.classList.remove('is-valid');
				}
				else 
				{
					inputMarke.classList.add('is-valid');
					inputMarke.classList.remove('is-invalid');
					this.benutzer.eigeneszugfahrzeugmarke = inputMarke.value;
				}

				if (!inputModell.value) 
				{
					saveOk = false;
					inputModell.classList.add('is-invalid');
					inputModell.classList.remove('is-valid');
				}
				else 
				{
					inputModell.classList.add('is-valid');
					inputModell.classList.remove('is-invalid');
					this.benutzer.eigeneszugfahrzeugmodell = inputModell.value;
				}

				if (!inputKennzeichen.value) 
				{
					saveOk = false;
					inputKennzeichen.classList.add('is-invalid');
					inputKennzeichen.classList.remove('is-valid');
				}
				else 
				{
					inputKennzeichen.classList.add('is-valid');
					inputKennzeichen.classList.remove('is-invalid');
					this.benutzer.eigeneszugfahrzeugkennzeichen = inputKennzeichen.value;
				}
			}

			if(saveOk)
			{
				ApiBenutzerSet(() => 
				{
					if (benutzerBild.bild_bytes) 
					{
						benutzerBild.users_id = this.benutzer.userid;
						ApiBilderSet(() => 
						{

						}, (ex) => 
						{
							alert(ex);
						}, benutzerBild);
					}
				}, (ex) => 
				{
					alert(ex);
				}, this.benutzer);
				window.open('http://localhost:5500/src/index.html', '_self');
			}
		}
	}
	else 
	{
		alert('Vorname, Nachname und Benutzername sind Pflicht!');
	}
});

//-------------------------------------------------------------
// Vorgang abbrechen

buttonBenutzerAbbrechen.addEventListener('click', (e) =>
{
	location.hash = '#main';
});
	
//-------------------------------------------------------------
// Daten Laden

function datenLaden(benutzerMerkmal)
{
	ApiBenutzerGet((response) =>
	{
		if(response.success)
		{
			this.benutzer = response.benutzer;
			this.benutzer.userid = response.benutzer.userid;

			inputBenutzername.value = this.benutzer.username;
			inputVorname.value = this.benutzer.vorname;
			inputNachname.value = this.benutzer.nachname;
			inputDateGeburtsdatum.value = new Date(this.benutzer.geburtsdatum).toLocaleDateString('en-CA');
			inputGeburtsort.value = this.benutzer.geburtsort;
			inputMarke.value = this.benutzer.eigeneszugfahrzeugmarke;
			inputModell.value = this.benutzer.eigeneszugfahrzeugmodell;
			inputKennzeichen.value = this.benutzer.eigeneszugfahrzeugkennzeichen;

			//  Profilbild anzeigen
			ApiBilderGetBenutzerList((response) =>
			{
				if(response != null && response.length > 0)
				{
					let bildliste = response;
					imgBild.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
				}
				// Führerscheinklassenlist anzeigen
				FSKListAnzeigen(this.benutzer.userid);
			}, (ex) => 
			{
				alert(ex);
			}, this.benutzer.userid);
		}
		else
		{
			alert(response.message);
		}
	}, (ex) => 
	{
		alert(ex);
	},  benutzerMerkmal);
}

// Führerscheinklassen anzeigen
function FSKListAnzeigen(benutzer_id) 
{
	const tableFSKList = document.querySelector('#tableFSKList');
	const trFSKHeader = document.querySelector('#trFSKHeader');

	let html = '';

	if(typeof this.benutzer != "undefined")
	{
		ApiBenutzerGetFSKList((response) => 
		{
			if(response != null)
			{
				this.fuehrerscheinklassenlist = response;
				let iterator = 0;
				for (let fskitem of this.fuehrerscheinklassenlist) 
				{
					html += 
					`
					<tr data-fsk-idx="${iterator}">
						<th scope="row">
						</th><th>
						<td scope="col">${(fskitem ? fskitem : '&nbsp;')}</td>
					</tr>
					`;
					iterator++;
				}
				tableFSKList.innerHTML = html;
			}
		}, (ex) => 
		{
			alert(ex);
		}, benutzer_id);
	}
	else
	{
		html = 
		`
		<td>Erzeugen Sie bitte einen Benutzer um die Führerscheinklassen eintragen zu können!</td>
		`
		trFSKHeader.innerHTML = html;
	}		
}

//-------------------------------------------------------------
// API

function ApiBenutzerGetById(successCallback, errorCallback, pid) 
{
	fetch(apiBaseUrl + 'benutzer/pid/' + pid, 
	{
		method: 'GET'
	})
	.then((response) => 
	{
		if (response.status == 200)
		{
			return response.json();
		} 
		else
		{
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.then(successCallback)
	.catch(errorCallback);
}

function ApiBilderGetBenutzerList(successCallback, errorCallback, users_id)
{
	fetch(apiBaseUrl + 'bilder/benutzer/' + users_id, 
	{
		method: 'GET',
		credentials: 'include'
	})
	.then((response) => 
	{
		if (response.status == 200) 
		{
			return response.json();
		}
		else
		{
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.then(successCallback)
	.catch(errorCallback);
}

function ApiBilderSet(successCallback, errorCallback, bild)
{
	fetch(apiBaseUrl + 'bilder', 
	{
		method: bild.kraftfahrzeug_id ? 'PUT' : 'POST',
		cache: 'no-cache',
		headers: 
		{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(bild)
	})
	.then((response) => 
	{
		if (response.status == 200) 
		{
			return response.json();
		}
		else if (response.status == 204) 
		{
			errorCallback('Daten sind unvollständig!');
		}
		else
		{
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.then(successCallback)
	.catch(errorCallback);
}

function ApiBenutzerGetFSKList(successCallback, errorCallback, pid)
{
	fetch(apiBaseUrl + 'benutzer/fsk/' + pid, 
	{
		method: 'GET',
		cache: 'no-cache',
		credentials: 'include'
	})
	.then((response) => 
	{
		if (response.status == 200)
		{
			return response.json();
		} 
		else if(response.status == 204)
		{

		}
		else
		{
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.then(successCallback)
	.catch(errorCallback);
}

function ApiBenutzerSet(successCallback, errorCallback, benutzer) 
{
	fetch(apiBaseUrl + 'benutzer' + (benutzer.userid ? '/' + benutzer.userid : ''), 
	{
		method: benutzer.userid ? 'PUT' : 'POST',
		cache: 'no-cache',
		headers: 
		{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(benutzer)
	})
	.then((response) => 
	{
		if (response.status == 200) 
		{
			return successCallback('Daten wurden erfolgreich geschickt!');
		}
		else if (response.status == 204) 
		{
			errorCallback('Daten sind unvollständig!');
		}
		else
		{

			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.catch(errorCallback);
}

function ApiBenutzerCheck(successCallback, errorCallback, check) 
{
	fetch(apiBaseUrl + 'benutzer/check/' + check, 
	{
		method: 'GET'
	})
	.then((response) => 
	{
		if (response.status == 200)
		{
			return response.json();
		} 
		else
		{
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.then(successCallback)
	.catch(errorCallback);
}

function ApiBenutzerFSKAdd(successCallback, errorCallback, pid ,fskList)
{
	fetch(apiBaseUrl + 'benutzer/fsk/' + pid,
	{
		method: pid ? 'PUT' : 'POST',
		cache: 'no-cache',
		headers: 
		{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(fskList)
	})
	.then((response) => 
	{
		if (response.status == 200) 
		{
			return successCallback('Daten wurden erfolgreich geschickt!');
		}
		else if (response.status == 204) 
		{
			errorCallback('Daten sind unvollständig!');
		}
		else
		{
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.catch(errorCallback);
}

function ApiBenutzerGet(successCallback, errorCallback, id) 
{
	fetch(apiBaseUrl + 'benutzer/' + id, 
	{
		method: 'GET',
		credentials: 'include'
	})
	.then((response) => 
	{
		if (response.status == 200)
		{
			return response.json();
		} 
		else
		{
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.then(successCallback)
	.catch(errorCallback);
}

function ApiBenutzerGetFSKObject(successCallback, errorCallback, pid)
{
	fetch(apiBaseUrl + 'benutzer/objfsk/' + pid, 
	{
		method: 'GET',
		cache: 'no-cache',
		credentials: 'include'
	})
	.then((response) => 
	{
		if (response.status == 200)
		{
			return response.json();
		} 
		else
		{
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.then(successCallback)
	.catch(errorCallback);
}
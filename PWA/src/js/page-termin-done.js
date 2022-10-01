import Helper from "./helper.js";

export default class PageTerminDone
{
	constructor(args) 
	{
		this.app = args.app;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-termin-done.html', args.app.Main, () => 
	    {
            // Intilialisierung
			const divKraftfahrzeugJahre = this.app.Main.querySelector('#divKraftfahrzeugJahre');
            const divTermin = document.querySelector('#divTermin');
            const divOrt = document.querySelector('#divOrt');
            const divBeschreibung = document.querySelector('#divBeschreibung');
            const divGesamtpreis = document.querySelector('#divGesamtpreis');
            const divAuftragsende = document.querySelector('#divAuftragsende');
            const divAbstellort = document.querySelector('#divAbstellort');
            const tableSchadenList = document.querySelector('#tableSchadenList');
            const divKmStart = document.querySelector('#divKmStart');
            const divZeitStart = document.querySelector('#divZeitStart');
            const divKmEnde = document.querySelector('#divKmEnde');
            const divZeitEnde = document.querySelector('#divZeitEnde');
            const divZuZahlen = document.querySelector('#divZuZahlen');
            const buttonQRCode = document.querySelector('#buttonQRCode');			
			const damageListBody = document.querySelector('#damageListBody');
			const buttonSchadenAdd = document.querySelector('#buttonSchadenAdd');
			const dialogSchaden = new bootstrap.Modal(modalSchadenBody);
			const buttonModalSchadenSpeichern = args.app.Main.querySelector('#buttonModalSchadenSpeichern');
			const buttonModalSchadenAbbrechen = args.app.Main.querySelector('#buttonModalSchadenAbbrechen');

			// Hiding the ID for security
			history.replaceState({}, null, "./index.html#termindone");

			this.bildObject = {};

			// Initialisierung
			var kfzbild = {};

			if(args.bid)
			{
				let bewegung_id = parseInt(args.bid);
				this.datenLaden(bewegung_id);
			}

            // Event Listeners
            buttonQRCode.addEventListener('click', () =>
            {
                if(args.bid)
                {
                    this.app.ApiRentObjectGet((response) =>
                    {
                        if(response)
                        {
                            this.Helper = new Helper();
                            this.rentObject = this.Helper.CreateRentObject();

                            // Preparing rentObject
                            this.rentObject.bewegung_id = response.bewegung_id;
                            this.rentObject.users_id = response.users_id;
                            this.rentObject.beschreibung = response.beschreibung;
                            this.rentObject.grund = response.grund;
                            this.rentObject.abholort = response.abholort;
                            this.rentObject.rueckgabeort = response.rueckgabeort;
                            this.rentObject.abholdatum = response.abholdatum;
                            this.rentObject.abholzeit = response.abholzeit;
                            this.rentObject.rueckgabedatum = response.rueckgabedatum;
                            this.rentObject.rueckgabezeit = response.rueckgabezeit;
                            this.rentObject.gleicherRueckgabeort = response.gleicherRueckgabeort;
                            this.rentObject.schutzpaket = response.schutzpaket;
                            this.rentObject.braucht_fahrer = response.braucht_fahrer;
                            this.rentObject.fahrer_id = response.fahrer_id;
                            this.rentObject.preis_gesamt = response.preis_gesamt;
                            this.rentObject.preis_kfz = response.preis_kfz;
                            this.rentObject.preis_anhaenger = response.preis_anhaenger;
                            this.rentObject.preis_fahrer = response.preis_fahrer;
                            this.rentObject.preis_schutzpaket = response.preis_schutzpaket;
                            this.rentObject.allow_reload = response.allow_reload // variable to check if the aAendernButton on page-rent-step-three.js is active or not, so the data can be loaded anew
                            this.rentObject.transaction_finished = response.transaction_finished;
                            this.rentObject.bewegung_finished = true;
                            this.rentObject.kraftfahrzeug_id = response.kraftfahrzeug_id;
                            this.rentObject.anhaenger_id = response.anhaenger_id;
                            this.rentObject.times_rented = response.times_rented;
                            this.rentObject.kfz_bezeichnung = response.kfz_bezeichnung;
                            this.rentObject.anhaenger_bezeichnung = response.anhaenger_bezeichnung;
                            this.rentObject.tage_gemietet = response.tage_gemietet;
                            this.rentObject.start_km_stand = response.start_km_stand;
                            this.rentObject.zeit_start = response.zeit_start;
                            this.rentObject.ende_km_stand = response.ende_km_stand;
                            this.rentObject.zeit_ende = response.zeit_ende;

                            // Updating the database
                            this.app.ApiRentObjectSet(() =>
                            {
                                console.log("database updated!");
                                localStorage.setItem('kid', this.rentObject.kraftfahrzeug_id);
								localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
								window.open('#finishrent?bid=' + this.rentObject.bewegung_id, '_self');
                            }, (ex) =>
                            {
                                alert(ex);
                            }, this.rentObject);
                        }
                    }, (ex) =>
                    {
                        alert(ex);
                    }, args.bid);
                } 
            });
            
			buttonSchadenAdd.addEventListener('click', async () =>
			{
				let videoPlayer = document.querySelector('#videoPlayer');
				let buttonCapturePhoto = document.querySelector('#buttonCapturePhoto');
				let canvas = document.querySelector('#canvas');
				let divImagePicker = document.querySelector('#divImagePicker');

				//initialize media
				if (!('mediaDevices' in navigator)) 
				{
					navigator.mediaDevices = {};
				}

				if (!('getUserMedia' in navigator.mediaDevices)) 
				{
					//take advantage of older methods for special browsers
					navigator.mediaDevices.getUserMedia = function(constraints) 
					{
						var getUserMedia = navigator.webkitGetUserMedia() || navigator.mozGetUserMedia;
						if (!getUserMedia) 
						{
							return Promise.reject(new Error('getUserMedia is not implemented!'));
						}

						return new Promise((resolve, reject) =>
						{
							getUserMedia.call(navigator, constraints, resolve, reject);
						});
					} 
				}

				labelAnfallendeKosten.value = '';
				selectSchadenArt.value = '0';
				labelBeschreibung.value = '';
				this.schaden = 
				{
					schaden_id: null,
					schaden_datum: new Date()
				};
				labelAnfallendeKosten.classList.remove('is-invalid', 'is-valid');
				selectSchadenArt.classList.remove('is-invalid', 'is-valid');

				try
				{
					let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
					videoPlayer.srcObject = stream;
				}
				catch
				{
					divImagePicker.style.display = 'block';
				}

				buttonCapturePhoto.addEventListener('click', () =>
				{
					let image_data_url;
					canvas.getContext('2d').drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
					videoPlayer.style.display = 'none';
					canvas.style.display = 'block';
					image_data_url = canvas.toDataURL('image/jpeg');

					// Create the object of the photo for sending
					let base64String = image_data_url.replace("data:", "").replace(/^.+,/, "");
					this.bildObject.bild_bytes = base64String;

					// Stops the cam from recording
					// videoPlayer.srcObject.getVideoTracks().forEach(function(track) 
					// {
					// 	track.stop();
					// });
				});

				dialogSchaden.show();
			});

			//---------------------------
			buttonModalSchadenSpeichern.addEventListener('click', (e) => 
			{
				this.stopVideo();
				let schadensArtText = "Unbekannt";
				let saveOk = true;
				labelAnfallendeKosten.classList.remove('is-invalid', 'is-valid');
				selectSchadenArt.classList.remove('is-invalid', 'is-valid');

				if (!labelAnfallendeKosten.value || (labelAnfallendeKosten.value && isNaN(labelAnfallendeKosten.value))) 
				{
					saveOk = false;
					labelAnfallendeKosten.classList.add('is-invalid');
				}
				else labelAnfallendeKosten.classList.add('is-valid');

				if (selectSchadenArt.value == '0') 
				{
					saveOk = false;
					selectSchadenArt.classList.add('is-invalid');
				}
				else selectSchadenArt.classList.add('is-valid');

				if (saveOk) 
				{
					if (!this.schaden) 
					{
						this.schaden = 
						{
							schaden_id: null,
							schaden_datum: new Date()
						};
					}
					schadensArtText = selectSchadenArt.options[selectSchadenArt.selectedIndex].text;
					this.schaden.kraftfahrzeug_id = parseInt(localStorage.getItem("kid"));
					this.schaden.anfallendekosten = (labelAnfallendeKosten.value && !isNaN(labelAnfallendeKosten.value) ? parseInt(labelAnfallendeKosten.value) : 0);
					this.schaden.schadensart = schadensArtText;
					this.schaden.beschreibung = labelBeschreibung.value;
                    if(args.bid)
                    {
                        this.app.ApiRentObjectGet((response) =>
                        {
                            if(response)
                            {
                                this.schaden.users_id = response.users_id;
                                if(divDateSchaden.value == "")
                                {
                                    this.schaden.schaden_datum = null;
                                }
                                else
                                {
                                    this.schaden.schaden_datum = divDateSchaden.value;
                                }
                                
                                // Get the date of the "photo" to find schaden_id later on
                                this.schaden.foto_datum = Date.now();

                                if (!this.schadenList)
                                {
                                    this.schadenList = [];
                                } 
                                
                                this.schadenList[0] = this.schaden;
                                
                                // Update the database.
                                this.app.ApiSchadenSet((response) => 
                                {
                                    console.log("database was updated!");
                                    if (this.bildObject) 
                                    {
                                        // Get schaden_id for the picture
                                        this.app.ApiSchadenGetId((response) =>
                                        {
                                            this.bildObject.schaden_id = response;
                                            // update the database
                                            this.app.ApiBildSet(() => 
                                            {
                                                if(args.bid)
                                                {
                                                    let bewegung_id = parseInt(args.bid);
                                                    this.datenLaden(bewegung_id);
                                                }
                                            }, (ex) => 
                                            {
                                                alert(ex);
                                            }, this.bildObject);
                                        }, (ex) => 
                                        {
                                            alert(ex);
                                        }, this.schaden.foto_datum);
                                    }
                                    else
                                    {
                                        if(args.bid)
                                        {
											// Stops the cam from recording
											if(videoPlayer)
											{
												videoPlayer.srcObject.getVideoTracks().forEach(function(track) 
												{
													track.stop();
												});
											}

                                            let bewegung_id = parseInt(args.bid);
                                            this.datenLaden(bewegung_id);
                                        }
                                    }
                                }, (ex) => 
                                {
                                    alert(ex);
                                }, this.schaden);

                                dialogSchaden.hide();
                            }
                        }, (ex) =>
                        {
                            alert(ex);
                        }, args.bid);
                    } 
				}
			});

			buttonModalSchadenAbbrechen.addEventListener('click', () =>
			{
				this.stopVideo();
			});
		}); // LoadHTML
	} // constructor

	//----------------------------------------------------------------------------------------
	// Anzeige

    datenLaden(bewegung_id) 
	{
        // Initialisierung
        const divLetzterKm = document.querySelector('#divLetzterKm');
        const divKmStart = document.querySelector('#divKmStart');

		this.app.ApiRentObjectGet((response) => 
		{
            const dateFormatter = new Intl.DateTimeFormat('de-AT', 
            {
                dateStyle: 'short'
            });

            this.Helper = new Helper();
			this.bewegung = response;

            // Auftragsdaten auffüllen
			divTermin.innerHTML = dateFormatter.format(new Date(this.bewegung.abholdatum)) + ' ' + this.bewegung.abholzeit + ' Uhr';
			divOrt.innerHTML = this.bewegung.abholort;
			divBeschreibung.innerHTML = this.bewegung.beschreibung;
			divAuftragsende.innerHTML = dateFormatter.format(new Date(this.bewegung.rueckgabedatum)) + ' ' + this.bewegung.rueckgabezeit + ' Uhr';
			divAbstellort.innerHTML = this.bewegung.rueckgabeort;
            divKmStart.innerHTML = this.bewegung.start_km_stand;
            divZeitStart.innerHTML = this.bewegung.zeit_start;
            divKmEnde.innerHTML = this.bewegung.ende_km_stand;
            divZeitEnde.innerHTML = this.bewegung.zeit_ende;
            divZuZahlen.innerHTML = this.bewegung.preis_gesamt + ',- €';

            this.app.ApiKraftfahrzeugGet((response) =>
            {
                divLetzterKm.innerHTML = response.km_stand;
                localStorage.setItem('kid', response.kraftfahrzeug_id);

                // Schadenliste anzeigen
                this.schadenListAnzeigen(response.kraftfahrzeug_id);
            }, (ex) =>
            {
                alert(ex);
            }, this.bewegung.kraftfahrzeug_id);                            
		}, (ex) => 
		{
			alert(ex);
		}, bewegung_id);
	}

    // functions
	schadenListAnzeigen(kraftfahrzeug_id)
	{
		// Initialisierung
		const dateFormatter = new Intl.DateTimeFormat('de-AT', 
        {
            dateStyle: 'short'
        });

		// logic
		this.app.ApiSchadenGetKfzList((response) =>
		{
			let html = '';
			let iterator = 1;
			if(response == null)
			{
				damageListBody.innerHTML = `<p>Es gibt keine Schäden am Fahrzeug!</p>`;
			}
			else
			{
				damageListBody.innerHTML = '';
				for (let schaden of response) 
				{
					html = 
					`<div class="card cards mt-3" style="width: 18rem;">
						<img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-schaden-id="${schaden.schaden_id}" id="imgBild_${iterator}">
						<div class="card-body" data-schaden-id="${schaden.schaden_id}">
							<h5 class="card-title">Schaden Nummer ${iterator}</h5>
							<p class="card-text">
								Schadensart: ${schaden.schadensart}<br>
								Beschreibung: ${schaden.beschreibung}<br>
								Anfallende Kosten: €${schaden.anfallendekosten},-<br>
								Datum des entstandenen Schadens: ${dateFormatter.format(new Date(schaden.schaden_datum))}<br>
							</p>
						</div>
					</div>
					`;
					iterator++;
					damageListBody.innerHTML += html;
				}
				this.app.ApiBilderGetAllSchadenListFromKfz((response) =>
                {
					if(response.length > 0)
					{
						// jiterator here, is the total amount of times we have assigned a picture to its HTML element
						let jiterator = 1;
						for (let schadenBild of response)
						{
							// iterator-1 here, is the total number of cards we put on screen in the previous API call
							for(let kiterator = 1; kiterator <= (iterator-1); kiterator++)
							{
								if(jiterator <= response.length)
								{
									var imgIdentifier = "imgBild_" + kiterator.toString();
									var imgBild = document.getElementById(imgIdentifier);
			
									if(schadenBild.schaden_id == imgBild.dataset.schadenId)
									{
										imgBild.src = "data:image/jpeg;base64," + schadenBild.bild_bytes;
										jiterator++;
									}	
								}
							}
						}
					}
                }, (ex) => 
                {
                    alert(ex);
                }, kraftfahrzeug_id);
			}
		}, (ex) =>
		{
			alert(ex);
		}, kraftfahrzeug_id);
	}

	// Stops the Video player from recording
	stopVideo()
	{
		videoPlayer.pause();
		videoPlayer.currentTime = 0;
	}
}
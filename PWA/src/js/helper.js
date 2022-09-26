import './app.js';

export default class Helper
{
    constructor()
    {
        //=====================================================
		// local constants


        //=====================================================
		// local variables

        
        //=====================================================
		// logic
    }

    //=============================================================================
    // public methods
    //=============================================================================

    GegenstandZustandConverter(typeNumber)
    {
        switch(typeNumber)
        {
            case 0:
                return('frei');
            case 1:
                return('vermietet');
            case 2:
                return('Reparatur');
            case 3:
                return('Wartung');
            default:
                return('Fehler aufgetreten!');
        }
    }

    SchadensArtConverter(schadensart)
    {
        if(typeof schadensart === "string")
        {
            switch(schadensart)
            {
                case 'Unbekannt': return 0;
                case 'Blechschaden': return 1;
                case 'Glasbruch': return 2;
                case 'Marderschaden': return 3;
                case 'Lackschaden': return 4;
                case 'Parkschaden': return 5;
                case 'Frostschaden': return 6;
                case 'Totalschaden': return 7;
                case 'Sonstiger Schaden': return 8;
                default: return 0;
            }
        }
        else if(typeof schadensart === "number")
        {
            switch(schadensart)
            {
                case 0: return 'Unbekannt';
                case 1: return 'Blechschaden';
                case 2: return 'Glasbruch';
                case 3: return 'Marderschaden';
                case 4: return'Lackschaden';
                case 5: return 'Parkschaden';
                case 6: return 'Frostschaden';
                case 7: return 'Totalschaden';
                case 8: return 'Sonstiger Schaden';
                default: return 'Unbekannt';
            }
        }
        else
        {
            console.log("Conversion failed: schadensart is not a string or number!");
        }
    }

    RolleConverter(rolle)
    {
        if(typeof rolle === "string")
        {
            switch(rolle)
            {
                case 'Kunde': return 0;
                case 'Admin': return 1;
                case 'User': return 2;
                default: return 0;
            }
        }
        else if(typeof rolle === "number")
        {
            switch(rolle)
            {
                case 0: return 'Kunde';
                case 1: return 'Admin';
                case 2: return 'User';
                default: return 'Unbekannt';
            }
        }
        else
        {
            console.log("Conversion failed: rolle is not a string or number!");
        }
    }

    StatusConverter(status)
    {
        if(typeof status === "string")
        {
            switch(status)
            {
                case 'unbekannt': return 0;
                case 'frei': return 1;
                case 'termin': return 2;
                case 'krank': return 3;
                case 'urlaub': return 4;
                case 'keinFahrer': return 5;
                default: return 5;
            }
        }
        else if(typeof status === "number")
        {
            switch(status)
            {
                case 0: return 'unbekannt';
                case 1: return 'frei';
                case 2: return 'termin';
                case 3: return 'krank';
                case 4: return 'urlaub';
                case 5: return 'keinFahrer';
                default: return 'keinFahrer';
            }
        }
        else
        {
            console.log("Conversion failed: status is not a string or number!");
        }
    }

    // Preisberechnung
    PriceCalculator(firstDay, lastDay, kfzPrice, paketPrice, anhaengerPrice, fahrerPrice)
    {
        let totalDays = this.TotalDaysCalculator(firstDay, lastDay);
        let result = 0;

        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
        this.rentObject.tage_gemietet = totalDays;
        localStorage.setItem('rentObject', JSON.stringify(this.rentObject));

        if(typeof paketPrice === "undefined" && typeof anhaengerPrice === "undefined" && typeof fahrerPrice === "undefined")
        {
            result = (totalDays * kfzPrice);
        }
        else if(typeof fahrerPrice === "undefined" && typeof anhaengerPrice === "undefined")
        {
            result = (totalDays * kfzPrice) + paketPrice;
        }
        else if(typeof fahrerPrice === "undefined" && typeof paketPrice === "undefined")
        {
            result = (totalDays * kfzPrice) + (totalDays * anhaengerPrice);
        }
        else if(typeof fahrerPrice === "undefined")
        {
            result = (totalDays * kfzPrice) + (totalDays * anhaengerPrice) + paketPrice;
        }
        else
        {
            result = (totalDays * kfzPrice) + (totalDays * anhaengerPrice) + (totalDays * fahrerPrice) + paketPrice;
        }
        
        return result;
    }

    // Berechnet für wieviele Tage die Mietung stattfindet, indem es den letzten Tag vom ersten Tag abzieht, und dann von millisekunden in Tage umrechnet.
    TotalDaysCalculator(firstDay, lastDay)
    {
        let difference = this.parseDate(lastDay).getTime() - this.parseDate(firstDay).getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return totalDays;
    }

    // parse a date in yyyy-mm-dd format
    parseDate(input) 
    {
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
    }

    CreateRentObject()
    {
        if(this.rentObject == null)
        {
            this.rentObject = // variable that constitutes the current order of the client. It gets completed throughout the rent steps, and finally gets sent to the backend part
            {
                bewegung_id: null,
                users_id: null,
                beschreibung: null,
                grund: "Initalisierung...",
                abholort: null,
                rueckgabeort: null,
                abholdatum: null,
                abholzeit: null,
                rueckgabedatum: null,
                rueckgabezeit: null,
                gleicherRueckgabeort: false,
                schutzpaket: null,
                braucht_fahrer: false,
                fahrer_id: null,
                preis_gesamt: 0,
                preis_kfz: 0,
                preis_anhaenger: 0,
                preis_fahrer: 0,
                preis_schutzpaket: 0,
                allow_reload: true, // variable to check if the aAendernButton on page-rent-step-three.js is active or not, so the data can be loaded anew
                transaction_finished: false,
                bewegung_finished: false,
                kraftfahrzeug_id: null,
                anhaenger_id: null,
                times_rented: 0,
                kfz_bezeichnung: null,
                anhaenger_bezeichnung: null,
                tage_gemietet: 0
            };
            return this.rentObject;
        }
    }
}
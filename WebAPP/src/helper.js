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
				case 'Office': return 4;
				default: return 3;
			}
		}
		else if(typeof rolle === "number")
		{
			switch(rolle)
			{
				case 0: return 'Kunde';
				case 1: return 'Admin';
				case 2: return 'User';
				case 4: return 'Office';
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
}
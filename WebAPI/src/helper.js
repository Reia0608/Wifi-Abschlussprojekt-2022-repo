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
}
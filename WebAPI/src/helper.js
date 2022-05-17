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

}
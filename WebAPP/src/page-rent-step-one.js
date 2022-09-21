import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


export default class PageRentStepOne
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-one.html', appArgs.app.Main, () => 
		{
            // Initialisierung
            const inputButtonAbbrechen1 = this.app.Main.querySelector('#inputButtonAbbrechen1');
            const inputButtonAbbrechen2 = this.app.Main.querySelector('#inputButtonAbbrechen2');
            const inputButtonWeiter1 = this.app.Main.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = this.app.Main.querySelector('#inputButtonWeiter2');

            const inputCheckboxGleicherRueckgabeort = this.app.Main.querySelector('#inputCheckboxGleicherRueckgabeort');
            const divRowRueckgabeort = this.app.Main.querySelector('#divRowRueckgabeort');

            // Variablen
            var gleicherRueckgabeort = false;

            // Event Listeners
            inputButtonAbbrechen1.addEventListener('click', ()=>
            {
                location.hash = '#cars';
            });

            inputButtonAbbrechen2.addEventListener('click', ()=>
            {
                location.hash = '#cars';
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                location.hash = '#rentsteptwo';
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
                location.hash = '#rentsteptwo';
            });
            
            inputCheckboxGleicherRueckgabeort.addEventListener('click', (e) =>
			{
				if(inputCheckboxGleicherRueckgabeort.checked == true)
				{
                    gleicherRueckgabeort = true;
					divRowRueckgabeort.classList.add("d-none");
				}
				else
				{
                    gleicherRueckgabeort = false;
					divRowRueckgabeort.classList.remove("d-none");
				}
			});
		});
	}
}
import { useEffect } from "react";
import SidebarButton from "../Sidebar/SidebarButton";
import HelpTable from "./HelpTable";
import SampleCart from "./SampleCart";
import GeneCart from "./GeneCart";

interface FullSidebarProps {
  samples: string[];
  setSamples: any;
  genes: string[];
  setGenes: any;
  setCurrentTab: any;
}

function FullSidebar({
  samples,
  setSamples,
  genes,
  setGenes,
  setCurrentTab,
}: FullSidebarProps) {
  /////////////////////////////// GET COOKIES FUNCTION ////////////////////////////////
  // Function to get the cookie value for any given cookie name
  function getCookie(cookieName: string) {
    var name = cookieName + "="; // Cookies are stored in the format "name=value"
    var allCookies = document.cookie.split(";"); //The username cookie will be in here
    //    console.log(ca);
    for (var i = 0; i < allCookies.length; i++) {
      //iterate through all cookies
      var currentCookie = allCookies[i];
      //        console.log(currentCookie);
      while (currentCookie.charAt(0) === " ") {
        currentCookie = currentCookie.substring(1); //Get rid of any leading spaces
      }
      if (currentCookie.indexOf(name) === 0) {
        //Check if cookie starts with the name of the cookie we're looking for
        return currentCookie.substring(name.length, currentCookie.length); //If the cookie is found, return the value
      }
    }
    return "";
  }

  useEffect(() => {
    // Update samples from the cookie whenever the component mounts
    const cookieSamples = getCookie("samples")
      ? getCookie("samples").split(" ")
      : [];
    setSamples(cookieSamples);
  }, [setSamples]); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Update the "samples" cookie whenever samples changes
    document.cookie = "samples=" + samples.join(" ");
  }, [samples]); // This runs whenever samples changes

  useEffect(() => {
    // Update genes from the cookie whenever the component mounts
    const cookieGenes = getCookie("genes") ? getCookie("genes").split(" ") : [];
    setGenes(cookieGenes);
  }, [setGenes]); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Update the "genes" cookie whenever genes changes
    document.cookie = "genes=" + genes.join(" ");
  }, [genes]); // This runs whenever genes changes

  //////////////////////////////// REMOVAL FUNCTIONS ////////////////////////////////

  const removeSample = (sampleToRemove: string) => {
    setSamples((prevSamples: string[]) =>
      prevSamples.filter((sample: string) => sample !== sampleToRemove)
    );
  };

  const removeGene = (geneToRemove: string) => {
    setGenes((prevGenes: string[]) =>
      prevGenes.filter((gene: string) => gene !== geneToRemove)
    );
  };

  //////////////////////////////// RESET CART FUNCTIONS ////////////////////////////////

  function resetSampleCart() {
    setSamples([]);
  }

  function resetGeneCart() {
    setGenes([]);
  }

  //////////////////////////////// OTHER FUNCTIONS ////////////////////////////////

  function fillExample() {
    resetSampleCart();
    setSamples(["EBOV_PBMC_Aerosol_RNASeq"]);
    setGenes(["isg15", "irf3"]);
  }

  function cartToSearch() {
    // This function is going to put the genes and samples into the search query
    setCurrentTab("ExecuteSearch");
  }

  //////////////////////////////// HTML ////////////////////////////////
  return (
    <div className="sidebar_outer">
      <div className="helpbox_outer_div">
        <div className="helpbox_padding">
          <HelpTable fillExample={fillExample} />
        </div>
      </div>
      <div className="s_cart_outer_div">
        <div className="helpbox_padding">
          <div className="sidebar_header">Data Cart</div>
          <div className="sidebar" id="sidebar_modifiers">
            <SampleCart samples={samples} removeSample={removeSample} />
          </div>
          <SidebarButton value="Clear Cart" handleClick={resetSampleCart} />
        </div>
      </div>
      <form id="searchGene" name="CARTform">
        <div className="cart_outer_div">
          <div className="helpbox_padding">
            <div className="sidebar_header">Gene Cart</div>
            <div className="sidebar">
              <GeneCart genes={genes} removeGene={removeGene} />
            </div>
            <SidebarButton value="Clear Cart" handleClick={resetGeneCart} />
            <SidebarButton value="Go To Search" handleClick={cartToSearch} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default FullSidebar;

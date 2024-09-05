import { useState } from "react";

const DataTable = () => {
  const [descriptionVisible, setDescriptionVisible] = useState(true);

  const handleToggleDescription = () => {
    setDescriptionVisible(!descriptionVisible);
  };

  return (
    <div className="search_data_outer_div" style={{ width: "90%" }}>
      <table>
        <thead>
          <tr>
            <th>Dataset</th>
            <th>Virus</th>
            <th>Publication</th>
            <th>GEO or Bioproject Number</th>
            <th>Sequencing Type</th>
            <th>Lab</th>
            <th
              className="description"
              style={{ cursor: "pointer" }}
              onClick={handleToggleDescription}
            >
              {descriptionVisible
                ? "Click to Hide Description"
                : "Click to Show Description"}
            </th>
            <th>PFU</th>
            <th>Route of Infection</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EBOV_IRF WB RNASeq</td>
            <td>Ebola Makona</td>
            <td>
              <a
                target="_blank"
                href="https://pubmed.ncbi.nlm.nih.gov/30476250/"
              >
                Link
              </a>
            </td>
            <td>
              <a
                target="_blank"
                href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE115785"
              >
                GSE115785
              </a>
            </td>
            <td>Single End 100bp Reads</td>
            <td>Integrated Research Facilities (IRF) in Fredrick, MD</td>
            {descriptionVisible ? (
              <td>
                This study examined Ebola Makona in an animal model. All the
                animals were given a classic lethal dose of the virus (1000 PFU
                via intramuscular injection). This study focused on answering
                the questions 1) Do viral titers reach the same levels as with
                Kikwit and Mayinga strains of the virus and 2) Does the time to
                death for the Makona strain remain the same.
              </td>
            ) : (
              <td />
            )}
            <td>1000</td>
            <td>Intramuscular Injection</td>
          </tr>
          <tr>
            <td>EBOV PBMC aerosol RNASeq</td>
            <td>Ebola Mayinga</td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/pubmed/23262834"
              >
                Link
              </a>
            </td>
            <td></td>
            <td>Single End Reads</td>
            <td>
              US Army Medical Research Institute of Infectious Diseases
              (USAMRIID)
            </td>
            {descriptionVisible ? (
              <td>
                Ebola is classified as a category A bioterrorist threat. The
                main method to weaponize a biological agent is through the
                development of aerosol dissemination methods for the agent. This
                study examined the infectivity of the Ebola virus when animals,
                rhesus macaques, were exposed via an aerosol route.
              </td>
            ) : (
              <td />
            )}
            <td>1000</td>
            <td>Aerosol</td>
          </tr>
          <tr>
            <td>EBOV PBMC Drug Microarray</td>
            <td>Ebola Mayinga</td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/pubmed/21987740"
              >
                Link
              </a>
            </td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE24943"
              >
                GSE24943
              </a>
            </td>
            <td>Microarray</td>
            <td>
              US Army Medical Research Institute of Infectious Diseases
              (USAMRIID)
            </td>
            {descriptionVisible ? (
              <td>
                A pathology of Ebola is disseminated intravascular coagulation
                (DIC), a condition in which systemic deregulation of the
                coagulation system causes body-wide activation of clotting
                factors resulting in their depletion and eventual systemic
                hemorrhage. This study examined a possible treatment for DIC,
                the infusion of new clotting factors, in rhesus macaques
                infected with lethal doses of Ebola.
              </td>
            ) : (
              <td />
            )}
            <td>1000</td>
            <td>Subcutaneous Injection</td>
          </tr>
          <tr>
            <td>EBOV PBMC Vaccine RNASeq</td>
            <td>Ebola Kitwit</td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/pubmed/25589554"
              >
                Link
              </a>
            </td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE64538"
              >
                GSE64538
              </a>
            </td>
            <td>RNA Seq</td>
            <td>
              Integrated Research Facilities (IRF) at Rocky Mountain Labs (RML)
            </td>
            {descriptionVisible ? (
              <td>
                This study examined the efficiency of the VSV/EBOVgp vaccine
                currently in phase I clinical trials. Subjects were exposed to
                either Marburg vaccine VSV/MARVgp or Ebola vaccine VSV/EBOVgp
                prior to a lethal dose of Ebola. Those that received the Marburg
                vaccine had a 0% survival rate. Those that received the Ebola
                vaccine had a 100% survival rate. To date, this vaccine has been
                shown to be highly effective in animal models.
              </td>
            ) : (
              <td />
            )}
            <td>1000</td>
            <td>Intramuscular Injection</td>
          </tr>
          <tr>
            <td>EBOV WB Nanostring</td>
            <td>Ebola</td>
            <td>
              <a
                target="_blank"
                href="https://pubmed.ncbi.nlm.nih.gov/29116224/"
              >
                Link
              </a>
            </td>
            <td>
              <a
                target="_blank"
                href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE99463"
              >
                GSE99463
              </a>
            </td>
            <td>Nanostring</td>
            <td>
              US Army Medical Research Institute of Infectious Diseases
              (USAMRIID)
            </td>
            {descriptionVisible ? (
              <td>
                This study examined different muscosal routes of exposure and
                infection to Ebola. Previous studies have found that the least
                common exposure vector for Ebola is via needle. Therefore, this
                study tested how effective exposure via the mucosal membranes
                (eg: Eyes, nose, mouth) were at infecting subjects.
              </td>
            ) : (
              <td />
            )}
            <td></td>
            <td>Mucosal Membrane</td>
          </tr>
          <tr className="unpublished">
            <td>EBOV WB RNASeq</td>
            <td>Ebola</td>
            <td>
              <a
                target="_blank"
                href="https://pubmed.ncbi.nlm.nih.gov/29593102/"
              >
                Link
              </a>
            </td>
            <td>
              <a
                target="_blank"
                href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE103825"
              >
                GSE103825
              </a>
            </td>
            <td>RNA Seq</td>
            <td>
              US Army Medical Research Institute of Infectious Diseases
              (USAMRIID)
            </td>
            {descriptionVisible ? (
              <td>This study pairs with the study above.</td>
            ) : (
              <td />
            )}
            <td></td>
            <td>Mucosal Membrane</td>
          </tr>
          <tr>
            <td>LASV PBMC RNASeq</td>
            <td>Lassa Josiah</td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/pubmed/25377889"
              >
                Link
              </a>
            </td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/bioproject/14864"
              >
                PRJNA14864
              </a>
            </td>
            <td>RNA Seq</td>
            <td>
              US Army Medical Research Institute of Infectious Diseases
              (USAMRIID)
            </td>
            {descriptionVisible ? (
              <td>
                A general classification of the Lassa virus in an animal model.
                Transcriptomes generated by this study were used to create a set
                of early unique classifiers to the Lassa Virus which were
                distinct from Ebola and Marburg viral infections.
              </td>
            ) : (
              <td />
            )}
            <td>1000</td>
            <td>Aerosol</td>
          </tr>
          <tr>
            <td>MARV PBMC RNASeq</td>
            <td>Marburg Angola</td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/pubmed/25377889"
              >
                Link
              </a>
            </td>
            <td>
              <a
                target="_blank"
                href="http://www.ncbi.nlm.nih.gov/bioproject/15199"
              >
                PRJNA15199
              </a>
            </td>
            <td>RNA Seq</td>
            <td>
              US Army Medical Research Institute of Infectious Diseases
              (USAMRIID)
            </td>
            {descriptionVisible ? (
              <td>
                A general classification of the Marburg virus in an animal
                model. Transcriptomes generated by this study were used to
                create a set of early unique classifiers to the Marburg Virus
                which were distinct from Ebola and Lassa viral infections.
              </td>
            ) : (
              <td />
            )}
            <td>1000</td>
            <td>Aerosol</td>
          </tr>
          <tr>
            <td> BOMV PBMC RNASeq </td>
            <td> BOMV </td>
            <td> Currently Unpublished</td>
            <td> </td>
            <td> RNA Seq</td>
            <td> </td>
            {descriptionVisible ? (
              <td>
                This study measures RNA expression data from several animal
                species by BOMV virus.
              </td>
            ) : (
              <td />
            )}
            <td></td>
            <td>IM</td>
          </tr>
          <tr>
            <td> TAFV PBMC RNASeq </td>
            <td> TAFV </td>
            <td> Currently Unpublished</td>
            <td> </td>
            <td> RNA Seq</td>
            <td> </td>
            {descriptionVisible ? (
              <td>
                This study measures RNA expression data from several animal
                species by TAFV virus.
              </td>
            ) : (
              <td></td>
            )}
            <td></td>
            <td>IM</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

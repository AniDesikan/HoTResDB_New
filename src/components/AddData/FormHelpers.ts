// helpers.ts
export const submitRequest = async (
    url: string,
    method: string = "POST",
    bodyData: any = {},
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    headers: { [key: string]: string } = { "Content-Type": "application/json" }
  ) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify(bodyData),
        headers,
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.response);
      } else {
        alert("Submission failed. Please check your input and try again.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred during submission. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  export const submitFileData = async (
    url: string,
    fileList: FileList | null,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (fileList && fileList.length > 0) {
      const formData = new FormData();
      console.log(fileList[0]);
      formData.append("rna_file", fileList[0]); // Assuming a single file is selected
      try {
        setLoading(true);
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.response);
        } else {
          alert("Submission failed. Please check your input and try again.");
        }
      } catch (error) {
        console.error("Error during submission:", error);
        alert("An error occurred during submission. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("No file selected");
    }
  };
  
  export const fetchPapersAndExperiments = async (
    setPapers: React.Dispatch<React.SetStateAction<any[]>>,
    setExperiments: React.Dispatch<React.SetStateAction<any[]>> | null = null
  ) => {
    try {
      const response = await fetch("/api/fillOutEnterData");
      const data = await response.json();
      const papersWithIds = data.papers.map((name:string, index:number) => ({
        id: index + 1,
        name: name,
      }));
      setPapers(papersWithIds);
      if (setExperiments) {
        setExperiments(data.experiments);
      }
      console.log(data);
      
    } catch (error) {
      console.error("Error fetching papers and experiments:", error);
    }
  };
  
  export const fetchExperiments = async (
    setExperiments: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    try {
      const response = await fetch("/api/fillOutEnterData");
      const data = await response.json();
      const experimentsWithIds = data.experiments.map((name:string, index:number) => ({
        id: index + 1,
        name: name,
      }));
      setExperiments(experimentsWithIds);
    } catch (error) {
      console.error("Error fetching experiments:", error);
    }
  };

  export const fetchNanostringExperiments = async (
    setExperiments: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    try {
      const response = await fetch("/api/fillOutEnterDataNanostring");
      const data = await response.json();
      const experimentsWithIds = data.experiments.map((name:string, index:number) => ({
        id: index + 1,
        name: name,
      }));
      setExperiments(experimentsWithIds);
    } catch (error) {
      console.error("Error fetching experiments:", error);
    }
  };
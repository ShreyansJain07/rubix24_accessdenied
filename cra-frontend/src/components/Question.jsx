import React, { useContext } from "react";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "../AppContext";
import { ArrowRight } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: "block",
    marginTop: "1rem",
  },
  button: {
    background: "white",
  },
}));
function Question() {
  const classes = useStyles();
  const value = useContext(AppContext);

  let { questionAnswer } = value.state;
  let { handleChangeInput, nextQuestion } = value.function;

  const [enhancedAnswer, setEnhancedAnswer] = React.useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.edenai.run/v2/text/generation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODIwNjhhMGQtYTIwNC00ZmZkLWEzODAtYWNmOTM1YzNmZjY0IiwidHlwZSI6ImFwaV90b2tlbiJ9.BHighurU1Ddd-2WuimMZ3sy13LCFoaB0WcpM8hGRTlQ",
          },
          body: JSON.stringify({
            providers: "google",
            text: `Enhance my answer ${questionAnswer.answer} to this question ${questionAnswer.question} only 2 paragraphs`,
            temperature: 0.2,
            max_tokens: 300,
            fallback_providers: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const enhancedText = data.google.generated_text;
      setEnhancedAnswer(() => {
        const enhancedAnswer = enhancedText.replace(/\*/g, ' ');
        handleChangeInput({ target: { value: enhancedAnswer } });
        return enhancedAnswer;
      });
      console.log(enhancedText);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  React.useEffect(() => {
    // Whenever the questionAnswer.answer changes, reset enhancedAnswer
    setEnhancedAnswer("");
  }, [questionAnswer.answer]);

  return (
    <div>
      <form noValidate autoComplete="on" onSubmit={nextQuestion}>
        <TextField
          id="standard-basic"
          label={questionAnswer.question}
          name={questionAnswer.resumeFieldId}
          value={enhancedAnswer || questionAnswer.answer || ""}
          onChange={handleChangeInput}
          style={{ width: "600px" }}
        />
        <div className={classes.buttonContainer}>
          <Button
            type="submit"
            variant="contained"
            color="default"
            className={classes.button}
            endIcon={<ArrowRight />}
          >
            Next
          </Button>
          <Button onClick={() => fetchData()} className={classes.button}>
            Enhance with AI
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Question;

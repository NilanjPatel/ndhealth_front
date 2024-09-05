import React, { useState } from "react";

const Question = {
  ref: { type: 'string' },
  type: { type: 'string' },
  quoteAnswer: { type: 'string' },
  quoteAnswers: { type: 'string' },
  headerStyle: { type: 'string' },
  subcategory: { type: 'string' },
  text: { type: 'string' },
  c: { type: 'string' },
  cNote: { type: 'string' },
  choices: {
    choice: {
      val: { type: 'string' },
      '@flag': { type: 'string' },
    },
  },
  items: { type: 'array', items: Question },
  listSep: { type: 'string' },
  lastSep: { type: 'string' },
  ownLine: { type: 'string' },
  showIf: { type: 'string' },
  value: { type: 'string' },
};

interface Props {
  question: Question;
  value?: string;
  onChange?: (value: string, ref: string) => void;
  showIf?: (answer: string | undefined) => boolean;
}

const QuestionForm: React.FC<Props> = ({ question, value, onChange, showIf }) => {
  const [show, setShow] = useState<boolean>(showIf ? showIf(value) : true);

  if (!show) {
    return null;
  }

  switch (question.type) {
    case "MENU":
      return (
        <div>
          <label>{question.c}</label>
          {question.choices && (
            <ul>
              {question.choices.choice.map((choice) => (
                <li key={choice.val}>
                  <input
                    type="radio"
                    checked={value === choice.val}
                    value={choice.val}
                    onChange={(e) => onChange && onChange(e.target.value, question.ref || "")}
                  />
                  <label>{choice.val}</label>
                  {choice["@flag"] === "GREEN" && <span style={{ color: "green" }}> (helpful)</span>}
                  {choice["@flag"] === "RED" && <span style={{ color: "red" }}> (requires immediate attention)</span>}
                  {choice["@flag"] === "YELLOW" && <span style={{ color: "yellow" }}> (concerning)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    case "MENU_MULTI_SELECT":
      return (
        <div>
          <label>{question.c}</label>
          <ul>
            {question.choices &&
              question.choices.choice.map((choice) => (
                <li key={choice.val}>
                  <input
                    type="checkbox"
                    checked={(value || "").split(",").includes(choice.val)}
                    value={choice.val}
                    onChange={(e) => {
                      const newValue = (value || "").includes(choice.val)
                        ? (value || "").replace(`,${choice.val}`, "").replace(choice.val + ",", "")
                        : (value || "") + (value ? "," : "") + choice.val;
                      onChange && onChange(newValue, question.ref || "");
                    }}
                  />
                  <label>{choice.val}</label>
                </li>
              ))}
          </ul>
        </div>
      );
    case "TEXT_FIELD":
    case "DATE":
      return (
        <div>
          <label>{question.cNote}</label>
          <input
            type={question.type}
            value={value || ""}
            onChange={(e) => onChange && onChange(e.target.value, question.ref || "")}
          />
        </div>
      );
    case "TEXT_AREA":
      return (
        <div>
          <label>{question.cNote}</label>
          <textarea
            value={value || ""}
            onChange={(e) => onChange && onChange(e.target.value, question.ref || "")}
          />
        </div>
      );
    case "PROPOSITION":
      return (
        <div>
          <label>{question.cNote}</label>
          <div>
            <input
              type="radio"
              checked={value === "yes"}
              value="yes"
              onChange={(e) => onChange && onChange(e.target.value, question.ref || "")}
            />
            <label>Yes</label>
          </div>
          <div>
            <input
              type="radio"
              checked={value === "no"}
              value="no"
              onChange={(e) => onChange && onChange(e.target.value, question.ref || "")}
            />
            <label>No</label>
          </div>
        </div>
      );
    default:
      return (
        <div>
          <label>{question.c}</label>
          {question.items &&
            question.items.map((item, index) => (
              <QuestionForm
                key={index}
                question={item}
                value={value}
                onChange={onChange}
                showIf={showIf}
              />
            ))}
          {question.ref && <input type="hidden" name={question.ref} value={value || ""} />}
        </div>
      );
  }
};

export default QuestionForm;
# Inference Feature - Usage Example

## Quick Start Guide

### Step 1: Locate the Inference Button

In the Phase Detail view, find your trained model. Each trained model card now has an **"Inference"** button next to the Evaluate button.

```
┌──────────────────────────────────────────────────┐
│ my-model-v1    [From Scratch]                    │
│                         [done] [Inference] [Evaluate] │
└──────────────────────────────────────────────────┘
```

### Step 2: Open the Inference Dialog

Click the "Inference" button to open the inference dialog.

### Step 3: Enter Your Text

Type or paste text into the textarea. You can:
- Enter a single text for one prediction
- Enter multiple texts (one per line) for batch inference

**Single Text Example:**
```
Send $100 to John
```

**Batch Inference Example:**
```
Send $100 to John
Can you pay me back?
Hello how are you?
What's the weather like today?
I need help with my account
```

### Step 4: Run Inference

Click the "Run Inference" button. The system will:
1. Split your input by newlines
2. Send all texts to the model
3. Display results for each text

### Step 5: Review Results

For each text, you'll see:

```
┌────────────────────────────────────────────┐
│ Text 1                      [payment]      │
│ Send $100 to John                          │
│ Confidence: 95.00%                         │
│                                            │
│ All Probabilities:                         │
│ [payment]   ██████████████████ 95.0%      │
│ [greeting]  █ 3.0%                         │
│ [other]     █ 2.0%                         │
└────────────────────────────────────────────┘
```

**Understanding the Results:**
- **Text N**: Shows which input this result corresponds to
- **[Label Badge]**: The predicted label
- **Input Text**: Your original text (shown in gray)
- **Confidence**: Probability of the predicted label (0-100%)
- **All Probabilities**: Visual bars showing probability distribution across all labels
  - Bars are sorted by probability (highest first)
  - The predicted label uses a solid color
  - Other labels use an outline style

### Step 6: Run More Inferences

To test with different inputs:
1. Click the "Clear" button to reset the form
2. Enter new text
3. Click "Run Inference" again

## Use Cases

### 1. Quick Model Testing
Test your model with sample inputs to verify it's working correctly:
```
Test payment model:
Send money to Alice
Transfer $50
Pay the invoice
```

### 2. Edge Case Testing
Test boundary cases and edge scenarios:
```
Empty-ish messages:
hi
.
???
```

### 3. Debugging Misclassifications
If evaluation shows errors, test specific examples to understand why:
```
Problematic cases:
Please send me the payment details
Can you help me send this?
```

### 4. Confidence Analysis
Check model confidence on ambiguous texts:
```
Ambiguous examples:
Can you help?
Please send
Let me know
```

### 5. Batch Classification
Classify multiple texts at once for quick analysis:
```
Customer messages:
I want to transfer money
Hello, how are you?
What are your hours?
Send $100 to my friend
Can I get a refund?
```

## Tips & Tricks

### Multi-line Support
- Each line becomes a separate inference
- Empty lines are automatically filtered out
- No limit on number of texts (within reasonable API limits)

### Understanding Probabilities
- **High confidence (>90%)**: Model is very sure
- **Medium confidence (70-90%)**: Model is fairly confident
- **Low confidence (<70%)**: Model is uncertain, review these cases

### Comparing Results
- Run the same text multiple times to check consistency
- Compare similar texts to see how the model differentiates
- Look at probability distributions, not just the predicted label

### Performance
- Batch inference is more efficient than running texts individually
- Results appear immediately after inference completes
- Dialog can be left open for multiple test runs

## Troubleshooting

### "Failed to run inference"
- Check that the model path is valid
- Verify the model training has completed successfully
- Ensure the pipeline ID is correct

### No results showing
- Make sure you entered text in the textarea
- Check that you clicked "Run Inference" (not just typed)
- Look for error messages in the red alert box

### Unexpected predictions
- Review the training data to ensure it covers similar examples
- Check the confidence scores - low confidence suggests uncertainty
- Look at all probabilities to see if multiple labels are close

## Advanced Usage

### Comparing Model Versions
1. Open inference dialogs for different models side by side
2. Enter the same test texts in both
3. Compare predictions and confidence scores

### Creating Test Sets
Use the inference feature to:
1. Identify texts where the model is uncertain
2. Create a list of edge cases for future testing
3. Document problematic examples for model improvement

### Analyzing Label Distribution
- Enter diverse texts covering all expected labels
- Check that all labels can be predicted
- Identify if any labels are rarely predicted

## Example Session

```
1. Open inference for "payment-classifier-v1"

2. Enter test texts:
   Send $100 to John
   Hello there
   What's your name?

3. Click "Run Inference"

4. Review results:
   ✓ Text 1: [payment] 98.5%
   ✓ Text 2: [greeting] 92.3%
   ✓ Text 3: [greeting] 89.1%

5. Clear and test edge case:
   send

6. Review result:
   ⚠ Text 1: [payment] 54.2%
   Note: Low confidence - ambiguous

7. Close dialog when done
```

## Best Practices

1. **Start Small**: Test with a few examples first
2. **Use Real Examples**: Test with actual user inputs when possible
3. **Check Confidence**: Don't just look at predictions, check confidence too
4. **Test Boundaries**: Try short texts, long texts, edge cases
5. **Document Findings**: Keep notes on problematic cases for model improvement

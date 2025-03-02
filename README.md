# Research and Development

This monorepo includes multiple projects and internal packages managed by Turborepo to streamline the development process

## Project Overview

###  LinkedIn Post Sentiment Analysis 

This project aims to develop a machine learning model capable of distinguishing the predominant mood of LinkedIn posts.
Initially, the focus will be on identifying three primary sentiments: aggression, joy, and neutrality.
Future developments may include the ability to recognize additional sentiments such as engagement and perceived value.

#### Objectives still under definition 🚧

1. **Phase 1: Sentiment Classification**
    - Develop or use a model to classify LinkedIn posts into three categories: aggressive, joyful, and neutral.
    - Collect or generate and preprocess a dataset of LinkedIn posts for training and testing.
    - Evaluate the model's performance and refine it to improve accuracy.


2. **Phase 2: Expand Sentiment Categories**
    - Enhance the model to recognize additional sentiments such as engagement and perceived value.
    - Update the dataset with new examples reflecting these sentiments.
    - Re-evaluate model performance and make necessary adjustments.

### Apps and Packages

`Apps/*` are dedicated to developing and integrating AI agents.

`Packages/*` are dedicated on shared modules and configurations.

- `apps/sandbox`: sandbox app
- `packages/typescript-config`: `tsconfig.json` used throughout the monorepo
- `packages/biome-config`: `biome.json` used throughout the monorepo


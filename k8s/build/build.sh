#!/bin/sh

rm -rf dice-game.yaml
for dir in postgres ckey mongo api gui
do
    yamls=$(ls ../$dir)
    for yaml in $yamls
    do
        cat "../$dir/$yaml" >> dice-game.yaml
        echo "\n---\n" >> dice-game.yaml
    done
done

rm -rf dice-game-admin.yaml
for dir in ckey-admin mongo-express
do
    yamls=$(ls ../$dir)
    for yaml in $yamls
    do
        cat ../$dir/$yaml >> dice-game-admin.yaml
        echo "\n---\n" >> dice-game-admin.yaml
    done
done
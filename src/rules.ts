/**
 * Embedded NAV (No Animal Violence) rules.
 *
 * Sourced from https://github.com/Open-Paws/semgrep-rules-no-animal-violence
 * This set is loaded at startup. The engine also attempts to fetch the full
 * upstream YAML at runtime and merges any additional rules found there.
 */

export type Severity = "ERROR" | "WARNING" | "INFO";

export interface NavRule {
  id: string;
  pattern: string;
  message: string;
  severity: Severity;
  alternative: string;
}

/** Embedded core rules — 65+ patterns from the canonical no-animal-violence set. */
export const EMBEDDED_RULES: NavRule[] = [
  {
    id: "animal-violence.kill-two-birds-with-one-stone",
    pattern: "kill\\s+two\\s+birds\\s+with\\s+one\\s+stone",
    message:
      'Animal violence language: "kill two birds with one stone". Consider: "accomplish two things at once", "solve two problems with one action".',
    severity: "ERROR",
    alternative: "accomplish two things at once",
  },
  {
    id: "animal-violence.beat-a-dead-horse",
    pattern: "beat(ing)?\\s+a\\s+dead\\s+horse",
    message:
      'Animal violence language: "beat a dead horse". Consider: "belabor the point", "go over old ground", "repeat unnecessarily".',
    severity: "ERROR",
    alternative: "belabor the point",
  },
  {
    id: "animal-violence.more-than-one-way-to-skin-a-cat",
    pattern: "more\\s+than\\s+one\\s+way\\s+to\\s+skin\\s+a\\s+cat",
    message:
      'Animal violence language: "more than one way to skin a cat". Consider: "more than one way to solve this", "multiple approaches available".',
    severity: "ERROR",
    alternative: "more than one way to solve this",
  },
  {
    id: "animal-violence.let-the-cat-out-of-the-bag",
    pattern: "let\\s+the\\s+cat\\s+out\\s+of\\s+the\\s+bag",
    message:
      'Animal violence language: "let the cat out of the bag". Consider: "reveal the secret", "disclose prematurely".',
    severity: "WARNING",
    alternative: "reveal the secret",
  },
  {
    id: "animal-violence.open-a-can-of-worms",
    pattern: "open(ing)?\\s+a\\s+can\\s+of\\s+worms",
    message:
      'Animal violence language: "open a can of worms". Consider: "create a complicated situation", "uncover hidden problems".',
    severity: "WARNING",
    alternative: "create a complicated situation",
  },
  {
    id: "animal-violence.wild-goose-chase",
    pattern: "wild\\s+goose\\s+chase",
    message:
      'Animal violence language: "wild goose chase". Consider: "futile search", "pointless pursuit".',
    severity: "WARNING",
    alternative: "futile search",
  },
  {
    id: "animal-violence.like-shooting-fish-in-a-barrel",
    pattern: "like\\s+shooting\\s+fish\\s+in\\s+a\\s+barrel",
    message:
      'Animal violence language: "like shooting fish in a barrel". Consider: "trivially easy", "effortless".',
    severity: "ERROR",
    alternative: "trivially easy",
  },
  {
    id: "animal-violence.flog-a-dead-horse",
    pattern: "flog(ging)?\\s+a\\s+dead\\s+horse",
    message:
      'Animal violence language: "flog a dead horse". Consider: "belabor the point", "waste effort on a settled matter".',
    severity: "ERROR",
    alternative: "belabor the point",
  },
  {
    id: "animal-violence.there-are-bigger-fish-to-fry",
    pattern: "bigger\\s+fish\\s+to\\s+fry",
    message:
      'Animal violence language: "there are bigger fish to fry". Consider: "more important matters to address", "higher priorities".',
    severity: "WARNING",
    alternative: "more important matters to address",
  },
  {
    id: "animal-violence.guinea-pig",
    pattern: "guinea\\s+pig",
    message:
      'Animal violence language: "guinea pig". Consider: "test subject", "early adopter".',
    severity: "WARNING",
    alternative: "test subject",
  },
  {
    id: "animal-violence.hold-your-horses",
    pattern: "hold\\s+your\\s+horses",
    message:
      'Animal violence language: "hold your horses". Consider: "wait a moment", "slow down", "be patient".',
    severity: "WARNING",
    alternative: "wait a moment",
  },
  {
    id: "animal-violence.the-elephant-in-the-room",
    pattern: "the\\s+elephant\\s+in\\s+the\\s+room",
    message:
      'Animal violence language: "the elephant in the room". Consider: "the obvious issue", "the unaddressed problem".',
    severity: "INFO",
    alternative: "the obvious issue",
  },
  {
    id: "animal-violence.straight-from-the-horses-mouth",
    pattern: "straight\\s+from\\s+the\\s+horse'?s\\s+mouth",
    message:
      'Animal violence language: "straight from the horse\'s mouth". Consider: "directly from the source", "firsthand".',
    severity: "WARNING",
    alternative: "directly from the source",
  },
  {
    id: "animal-violence.bring-home-the-bacon",
    pattern: "bring(ing)?\\s+home\\s+the\\s+bacon",
    message:
      'Animal violence language: "bring home the bacon". Consider: "bring home the results", "earn a living".',
    severity: "ERROR",
    alternative: "bring home the results",
  },
  {
    id: "animal-violence.take-the-bull-by-the-horns",
    pattern: "take?(ing|ook)?\\s+the\\s+bull\\s+by\\s+the\\s+horns",
    message:
      'Animal violence language: "take the bull by the horns". Consider: "face the challenge head-on", "tackle the problem directly".',
    severity: "WARNING",
    alternative: "face the challenge head-on",
  },
  {
    id: "animal-violence.like-lambs-to-the-slaughter",
    pattern: "like\\s+lambs?\\s+to\\s+(the\\s+)?slaughter",
    message:
      'Animal violence language: "like lambs to the slaughter". Consider: "without resistance", "blindly following".',
    severity: "ERROR",
    alternative: "without resistance",
  },
  {
    id: "animal-violence.no-room-to-swing-a-cat",
    pattern: "no\\s+room\\s+to\\s+swing\\s+a\\s+cat",
    message:
      'Animal violence language: "no room to swing a cat". Consider: "very cramped", "extremely tight space".',
    severity: "WARNING",
    alternative: "very cramped",
  },
  {
    id: "animal-violence.red-herring",
    pattern: "red\\s+herring",
    message:
      'Animal violence language: "red herring". Consider: "distraction", "false lead".',
    severity: "INFO",
    alternative: "distraction",
  },
  {
    id: "animal-violence.curiosity-killed-the-cat",
    pattern: "curiosity\\s+killed\\s+the\\s+cat",
    message:
      'Animal violence language: "curiosity killed the cat". Consider: "curiosity backfired", "curiosity led to trouble".',
    severity: "ERROR",
    alternative: "curiosity backfired",
  },
  {
    id: "animal-violence.like-a-chicken-with-its-head-cut-off",
    pattern: "like\\s+a\\s+chicken\\s+with\\s+(its|their)\\s+head\\s+cut\\s+off",
    message:
      'Animal violence language: "like a chicken with its head cut off". Consider: "in a panic", "running around chaotically".',
    severity: "ERROR",
    alternative: "in a panic",
  },
  {
    id: "animal-violence.your-goose-is-cooked",
    pattern: "(your|their|his|her)\\s+goose\\s+is\\s+cooked",
    message:
      'Animal violence language: "your goose is cooked". Consider: "you\'re in trouble", "your fate is sealed".',
    severity: "ERROR",
    alternative: "you're in trouble",
  },
  {
    id: "animal-violence.throw-someone-to-the-wolves",
    pattern: "throw(ing|n)?\\s+\\w+\\s+to\\s+the\\s+wolves",
    message:
      'Animal violence language: "throw someone to the wolves". Consider: "abandon to criticism", "leave to face hostility alone".',
    severity: "ERROR",
    alternative: "abandon to criticism",
  },
  {
    id: "animal-violence.hook-line-and-sinker",
    pattern: "hook,?\\s+line,?\\s+and\\s+sinker",
    message:
      'Animal violence language: "hook, line, and sinker". Consider: "completely", "fell for it entirely".',
    severity: "WARNING",
    alternative: "completely",
  },
  {
    id: "animal-violence.clip-someones-wings",
    pattern: "clip(ping|ped)?\\s+(\\w+('s)?\\s+)?wings",
    message:
      'Animal violence language: "clip someone\'s wings". Consider: "restrict someone\'s freedom", "limit someone\'s options".',
    severity: "WARNING",
    alternative: "restrict someone's freedom",
  },
  {
    id: "animal-violence.the-straw-that-broke-the-camels-back",
    pattern: "(the\\s+)?straw\\s+that\\s+broke\\s+the\\s+camel'?s\\s+back",
    message:
      'Animal violence language: "the straw that broke the camel\'s back". Consider: "the tipping point", "the breaking point".',
    severity: "WARNING",
    alternative: "the tipping point",
  },
  {
    id: "animal-violence.a-bird-in-the-hand",
    pattern:
      "bird\\s+in\\s+(the|a)\\s+hand\\s+(is\\s+)?worth\\s+two\\s+in\\s+the\\s+bush",
    message:
      'Animal violence language: "a bird in the hand is worth two in the bush". Consider: "a sure thing beats a possibility", "certainty over speculation".',
    severity: "WARNING",
    alternative: "a sure thing beats a possibility",
  },
  {
    id: "animal-violence.eat-crow",
    pattern: "eat(ing)?\\s+crow",
    message:
      'Animal violence language: "eat crow". Consider: "admit being wrong", "swallow one\'s pride".',
    severity: "WARNING",
    alternative: "admit being wrong",
  },
  {
    id: "animal-violence.fight-like-cats-and-dogs",
    pattern: "fight(ing)?\\s+like\\s+cats\\s+and\\s+dogs",
    message:
      'Animal violence language: "fight like cats and dogs". Consider: "constantly argue", "clash frequently".',
    severity: "WARNING",
    alternative: "constantly argue",
  },
  {
    id: "animal-violence.take-the-bait",
    pattern: "take?(ing|ook)?\\s+the\\s+bait",
    message:
      'Animal violence language: "take the bait". Consider: "fall for it", "be lured in".',
    severity: "WARNING",
    alternative: "fall for it",
  },
  {
    id: "animal-violence.dont-count-your-chickens",
    pattern: "don'?t\\s+count\\s+your\\s+chickens",
    message:
      'Animal violence language: "don\'t count your chickens before they hatch". Consider: "don\'t assume success prematurely", "wait for confirmed results".',
    severity: "WARNING",
    alternative: "don't assume success prematurely",
  },
  {
    id: "animal-violence.livestock",
    pattern: "livestock",
    message:
      'Animal violence language: "livestock". Consider: "farmed animals", "animals raised for food".',
    severity: "WARNING",
    alternative: "farmed animals",
  },
  {
    id: "animal-violence.poultry",
    pattern: "poultry",
    message:
      'Animal violence language: "poultry". Consider: "farmed birds", "chickens and turkeys".',
    severity: "WARNING",
    alternative: "farmed birds",
  },
  {
    id: "animal-violence.gestation-crate",
    pattern: "gestation crates?",
    message:
      'Animal violence language: "gestation crate". Consider: "pregnancy cage".',
    severity: "WARNING",
    alternative: "pregnancy cage",
  },
  {
    id: "animal-violence.depopulation",
    pattern: "depopulat(ion|ed|ing)",
    message:
      'Animal violence language: "depopulation". Consider: "mass killing", "killed en masse".',
    severity: "WARNING",
    alternative: "mass killing",
  },
  {
    id: "animal-violence.processing-plant",
    pattern: "processing (plants?|facilit(y|ies))",
    message:
      'Animal violence language: "processing plant". Consider: "slaughterhouse".',
    severity: "WARNING",
    alternative: "slaughterhouse",
  },
  {
    id: "animal-violence.farrowing-crate",
    pattern: "farrowing crates?",
    message:
      'Animal violence language: "farrowing crate". Consider: "birthing cage".',
    severity: "WARNING",
    alternative: "birthing cage",
  },
  {
    id: "animal-violence.battery-cage",
    pattern: "battery cages?",
    message:
      'Animal violence language: "battery cage". Consider: "small wire cage", "confined cage".',
    severity: "WARNING",
    alternative: "small wire cage",
  },
  {
    id: "animal-violence.spent-hen",
    pattern: "spent hens?",
    message:
      'Animal violence language: "spent hen". Consider: "discarded hen", "hen killed after egg production declines".',
    severity: "WARNING",
    alternative: "discarded hen",
  },
  {
    id: "animal-violence.humane-slaughter",
    pattern: "(humane(ly)? (slaughter(ed)?|kill(ing|ed)))",
    message:
      'Animal violence language: "humane slaughter". Consider: "slaughter", "killing".',
    severity: "WARNING",
    alternative: "slaughter",
  },
  {
    id: "animal-violence.broiler",
    pattern: "broilers?",
    message:
      'Animal violence language: "broiler". Consider: "chicken raised for meat", "meat chicken".',
    severity: "WARNING",
    alternative: "chicken raised for meat",
  },
  {
    id: "animal-violence.dont-be-a-chicken",
    pattern: "don'?t\\s+be\\s+a\\s+chicken",
    message:
      'Animal violence language: "don\'t be a chicken". Consider: "don\'t hesitate", "be brave".',
    severity: "WARNING",
    alternative: "don't hesitate",
  },
  {
    id: "animal-violence.code-pig",
    pattern: "(code|memory|resource)\\s+pig",
    message:
      'Animal violence language: "pig" (as in code/resource pig). Consider: "resource-intensive", "bloated".',
    severity: "WARNING",
    alternative: "resource-intensive",
  },
  {
    id: "animal-violence.cowboy-coding",
    pattern: "cowboy\\s+cod(ing|er)",
    message:
      'Animal violence language: "cowboy coding". Consider: "undisciplined coding", "ad-hoc development".',
    severity: "WARNING",
    alternative: "undisciplined coding",
  },
  {
    id: "animal-violence.code-monkey",
    pattern: "code\\s+monkeys?",
    message:
      'Animal violence language: "code monkey". Consider: "developer", "programmer".',
    severity: "WARNING",
    alternative: "developer",
  },
  {
    id: "animal-violence.badger-someone",
    pattern: "badger(ed|ing|s)?",
    message:
      'Animal violence language: "badger someone". Consider: "pester", "pressure", "harass".',
    severity: "WARNING",
    alternative: "pester",
  },
  {
    id: "animal-violence.ferret-out",
    pattern: "ferret(ed|ing)?\\s+out",
    message:
      'Animal violence language: "ferret out". Consider: "uncover", "discover", "dig up".',
    severity: "WARNING",
    alternative: "uncover",
  },
  {
    id: "animal-violence.cattle-vs-pets",
    pattern: "cattle\\s+(vs?\\.?|versus)\\s+pets?",
    message:
      'Animal violence language: "cattle vs. pets". Consider: "ephemeral vs. persistent", "disposable vs. unique".',
    severity: "WARNING",
    alternative: "ephemeral vs. persistent",
  },
  {
    id: "animal-violence.pet-project",
    pattern: "pet\\s+project",
    message:
      'Animal violence language: "pet project". Consider: "side project", "passion project".',
    severity: "INFO",
    alternative: "side project",
  },
  {
    id: "animal-violence.canary-in-a-coal-mine",
    pattern: "canary\\s+in\\s+(a|the)\\s+coal\\s+mine",
    message:
      'Animal violence language: "canary in a coal mine". Consider: "early warning signal", "leading indicator".',
    severity: "WARNING",
    alternative: "early warning signal",
  },
  {
    id: "animal-violence.dogfooding",
    pattern: "dog\\s?food(ing)?",
    message:
      'Animal violence language: "dogfooding". Consider: "self-hosting", "using internally".',
    severity: "INFO",
    alternative: "self-hosting",
  },
  {
    id: "animal-violence.herding-cats",
    pattern: "herding\\s+cats",
    message:
      'Animal violence language: "herding cats". Consider: "coordinating independent contributors", "organizing chaos".',
    severity: "WARNING",
    alternative: "coordinating independent contributors",
  },
  {
    id: "animal-violence.fishing-expedition",
    pattern: "fishing\\s+expedition",
    message:
      'Animal violence language: "fishing expedition". Consider: "exploratory investigation", "speculative inquiry".',
    severity: "WARNING",
    alternative: "exploratory investigation",
  },
  {
    id: "animal-violence.sacred-cow",
    pattern: "sacred\\s+cows?",
    message:
      'Animal violence language: "sacred cow". Consider: "unquestioned belief", "untouchable topic".',
    severity: "WARNING",
    alternative: "unquestioned belief",
  },
  {
    id: "animal-violence.scapegoat",
    pattern: "scapegoat(ed|ing|s)?",
    message:
      'Animal violence language: "scapegoat". Consider: "blame target", "wrongly blamed".',
    severity: "WARNING",
    alternative: "blame target",
  },
  {
    id: "animal-violence.rat-race",
    pattern: "rat\\s+race",
    message:
      'Animal violence language: "rat race". Consider: "daily grind", "competitive treadmill".',
    severity: "WARNING",
    alternative: "daily grind",
  },
  {
    id: "animal-violence.dead-cat-bounce",
    pattern: "dead[\\s_-]?cat[\\s_-]?bounce",
    message:
      'Animal violence language: "dead cat bounce". Consider: "temporary rebound", "false recovery".',
    severity: "WARNING",
    alternative: "temporary rebound",
  },
  {
    id: "animal-violence.dog-eat-dog",
    pattern: "dog[\\s-]eat[\\s-]dog",
    message:
      'Animal violence language: "dog-eat-dog". Consider: "ruthlessly competitive", "cutthroat".',
    severity: "WARNING",
    alternative: "ruthlessly competitive",
  },
  {
    id: "animal-violence.whack-a-mole",
    pattern: "whack[\\s-]a[\\s-]mole",
    message:
      'Animal violence language: "whack-a-mole". Consider: "recurring problem", "endless loop".',
    severity: "WARNING",
    alternative: "recurring problem",
  },
  {
    id: "animal-violence.cash-cow",
    pattern: "cash\\s+cows?",
    message:
      'Animal violence language: "cash cow". Consider: "profit center", "reliable revenue source".',
    severity: "WARNING",
    alternative: "profit center",
  },
  {
    id: "animal-violence.sacrificial-lamb",
    pattern: "sacrificial\\s+lambs?",
    message:
      'Animal violence language: "sacrificial lamb". Consider: "expendable person", "person set up to fail".',
    severity: "WARNING",
    alternative: "expendable person",
  },
  {
    id: "animal-violence.sitting-duck",
    pattern: "sitting\\s+ducks?",
    message:
      'Animal violence language: "sitting duck". Consider: "easy target", "vulnerable target".',
    severity: "WARNING",
    alternative: "easy target",
  },
  {
    id: "animal-violence.open-season",
    pattern: "open\\s+season",
    message:
      'Animal violence language: "open season". Consider: "free-for-all", "unrestricted criticism".',
    severity: "WARNING",
    alternative: "free-for-all",
  },
  {
    id: "animal-violence.put-out-to-pasture",
    pattern: "put(ting)?\\s+(\\w+\\s+)?out\\s+to\\s+pasture",
    message:
      'Animal violence language: "put out to pasture". Consider: "retire", "phase out", "sunset".',
    severity: "WARNING",
    alternative: "retire",
  },
  {
    id: "animal-violence.dead-duck",
    pattern: "dead\\s+ducks?",
    message:
      'Animal violence language: "dead duck". Consider: "lost cause", "doomed effort".',
    severity: "WARNING",
    alternative: "lost cause",
  },
  {
    id: "animal-violence.kill-process",
    pattern: "kill\\s+(the\\s+)?process",
    message:
      'Animal violence language: "kill process". Consider: "terminate the process", "stop the process".',
    severity: "WARNING",
    alternative: "terminate the process",
  },
  {
    id: "animal-violence.kill-the-server",
    pattern: "kill\\s+(the\\s+)?server",
    message:
      'Animal violence language: "kill the server". Consider: "stop the server", "shut down the server".',
    severity: "WARNING",
    alternative: "stop the server",
  },
  {
    id: "animal-violence.nuke",
    pattern: "nuke\\s+(it|the|this|that|everything)",
    message:
      'Animal violence language: "nuke". Consider: "delete completely", "wipe clean".',
    severity: "WARNING",
    alternative: "delete completely",
  },
  {
    id: "animal-violence.abort",
    pattern: "abort(ed|ing)?",
    message:
      'Animal violence language: "abort". Consider: "cancel", "stop", "halt".',
    severity: "INFO",
    alternative: "cancel",
  },
  {
    id: "animal-violence.cull",
    pattern: "cull(ed|ing|s)?",
    message:
      'Animal violence language: "cull". Consider: "remove", "prune", "trim".',
    severity: "WARNING",
    alternative: "remove",
  },
  {
    id: "animal-violence.master-slave",
    pattern: "(master|slave)",
    message:
      'Animal violence language: "master/slave". Consider: "primary/replica", "leader/follower", "controller/worker".',
    severity: "WARNING",
    alternative: "primary/replica",
  },
  {
    id: "animal-violence.whitelist-blacklist",
    pattern: "(white|black)list",
    message:
      'Animal violence language: "whitelist/blacklist". Consider: "allowlist/denylist", "permit list/block list".',
    severity: "WARNING",
    alternative: "allowlist/denylist",
  },
  {
    id: "animal-violence.grandfathered",
    pattern: "grandfather(ed|ing)?",
    message:
      'Animal violence language: "grandfathered". Consider: "legacy", "exempt", "pre-existing".',
    severity: "WARNING",
    alternative: "legacy",
  },
];
